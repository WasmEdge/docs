---
sidebar_position: 4
sidebar_label: Proxy-Wasm
title: Deploy Proxy-Wasm apps
---

# Proxy-Wasm

Proxy-Wasm is a binary interface (ABI) between a proxy (like Envoy or MOSN) and a WebAssembly virtual machine. WasmEdge can be seamlessly integrated as the high-performance runtime backend for Proxy-Wasm hosts.

This tutorial demonstrates how to build a standalone Proxy-Wasm host using the [proxy-wasm-cpp-host](https://github.com/proxy-wasm/proxy-wasm-cpp-host) library, write a WebAssembly filter, and execute it natively using WasmEdge.

## Prerequisites

Ensure your system has the following installed:

1. **WasmEdge:** Version `0.14.1` or higher. (See [Install WasmEdge](https://wasmedge.org/docs/start/install/))
2. **Build Tools:** A C++ compiler (`clang`/`gcc`), `cmake`, and `ninja`.
3. **WASI-SDK:** Required to compile the WebAssembly plugin (v32 or newer).

_(macOS Example: Installs WASI-SDK-32 in the Working directory and exports the WASI_SDK_PATH)_:

```bash
curl -fL -o wasi-sdk.tar.gz https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-32/wasi-sdk-32.0-arm64-macos.tar.gz && tar -zxf wasi-sdk.tar.gz && export WASI_SDK_PATH="$(pwd)/wasi-sdk-32.0-arm64-macos" && echo $WASI_SDK_PATH
```

4. **System Libraries:** OpenSSL and Abseil (Google's C++ library).

_(macOS Example)_:

```bash
brew install cmake ninja abseil openssl
```

## 1. Fetch Dependencies

Create a working directory and fetch the required Proxy-Wasm upstream dependencies:

```
mkdir -p proxy-wasm-demo/.deps
cd proxy-wasm-demo

# Clone SDK and Host libraries
git clone --depth=1 https://github.com/proxy-wasm/proxy-wasm-cpp-sdk .deps/proxy-wasm-cpp-sdk
git clone --depth=1 https://github.com/proxy-wasm/proxy-wasm-cpp-host .deps/proxy-wasm-cpp-host
```

## 2. Write the WebAssembly Plugin

Create a directory named `plugin`. This filter hooks into the HTTP response phase, logs the request, and injects a custom `x-powered-by: WasmEdge` header.

Create `plugin/plugin.cc`:

```cpp
// plugin/plugin.cc
//
// proxy-wasm filter using the raw ABI headers (no protobuf dependency).
// Uses the exact types defined in proxy_wasm_enums.h / proxy_wasm_common.h.
//
// What it does:
//   - Logs on every HTTP request.
//   - Adds "x-powered-by: WasmEdge" to every HTTP response.

#include <cstdint>
#include <cstring>
#include <string_view>

#include "proxy_wasm_common.h" // WasmResult, WasmHeaderMapType
#include "proxy_wasm_enums.h" // LogLevel, FilterHeadersStatus, FilterDataStatus
#include "proxy_wasm_externs.h" // proxy_log, proxy_add_header_map_value, …

static void log_info(std::string_view msg) {
  proxy_log(LogLevel::info, msg.data(), msg.size());
}

extern "C" {

__attribute__((export_name("proxy_abi_version_0_2_0"))) void
proxy_abi_version_0_2_0() {}

__attribute__((export_name("proxy_on_vm_start"))) uint32_t
proxy_on_vm_start(uint32_t, uint32_t) {
  log_info("[AddHeaderFilter] VM started on WasmEdge runtime.");
  return 1;
}

__attribute__((export_name("proxy_on_configure"))) uint32_t
proxy_on_configure(uint32_t, uint32_t) {
  log_info("[AddHeaderFilter] Plugin configured.");
  return 1;
}

__attribute__((export_name("proxy_on_context_create"))) void
proxy_on_context_create(uint32_t, uint32_t) {}

__attribute__((export_name("proxy_on_request_headers"))) FilterHeadersStatus
proxy_on_request_headers(uint32_t, uint32_t, uint32_t) {
  log_info("[AddHeaderFilter] Incoming HTTP request — passing through.");
  return FilterHeadersStatus::Continue;
}

__attribute__((export_name("proxy_on_response_headers"))) FilterHeadersStatus
proxy_on_response_headers(uint32_t, uint32_t, uint32_t) {
  constexpr std::string_view key = "x-powered-by";
  constexpr std::string_view value = "WasmEdge";
  proxy_add_header_map_value(
      WasmHeaderMapType::ResponseHeaders, // correct enum name
      key.data(), key.size(), value.data(), value.size());
  log_info(
      "[AddHeaderFilter] Injected 'x-powered-by: WasmEdge' into response.");
  return FilterHeadersStatus::Continue;
}

__attribute__((export_name("proxy_on_request_body"))) FilterDataStatus
proxy_on_request_body(uint32_t, uint32_t, uint32_t) {
  return FilterDataStatus::Continue;
}

__attribute__((export_name("proxy_on_response_body"))) FilterDataStatus
proxy_on_response_body(uint32_t, uint32_t, uint32_t) {
  return FilterDataStatus::Continue;
}

__attribute__((export_name("proxy_on_done"))) uint32_t proxy_on_done(uint32_t) {
  return 1;
}

__attribute__((export_name("proxy_on_log"))) void proxy_on_log(uint32_t) {}

__attribute__((export_name("proxy_on_delete"))) void proxy_on_delete(uint32_t) {
}

} // extern "C"

```

Create `plugin/CMakeLists.txt`:

```bash
cmake_minimum_required(VERSION 3.14)
project(proxy_wasm_add_header_plugin CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(NOT DEFINED PROXY_WASM_CPP_SDK_PATH)
  message(FATAL_ERROR "Set -DPROXY_WASM_CPP_SDK_PATH=<path>")
endif()

# ── wasi-sdk 25+ (Clang 22) fix ───────────────────────────────────────────────
# Newer wasi-sdk releases place C++ stdlib headers under a target-specific
# subdirectory of the sysroot (wasm32-wasip1/c++/v1/) rather than a flat
# include path.  Derive the SDK prefix from the toolchain file and wire up:
#   1. --sysroot pointing to share/wasi-sysroot
#   2. The target-specific C++ include directory
if(DEFINED CMAKE_TOOLCHAIN_FILE)
  # Toolchain file lives at <wasi-sdk>/share/cmake/wasi-sdk-p1.cmake
  get_filename_component(_WASI_CMAKE_DIR "${CMAKE_TOOLCHAIN_FILE}" DIRECTORY)
  get_filename_component(WASI_SDK_PREFIX "${_WASI_CMAKE_DIR}/../.." ABSOLUTE)
  set(WASI_SYSROOT "${WASI_SDK_PREFIX}/share/wasi-sysroot")
  if(EXISTS "${WASI_SYSROOT}")
    set(WASI_CXX_INCLUDE "${WASI_SYSROOT}/include/wasm32-wasip1/c++/v1")
    add_compile_options(--sysroot=${WASI_SYSROOT})
    if(EXISTS "${WASI_CXX_INCLUDE}")
      include_directories(SYSTEM "${WASI_CXX_INCLUDE}")
      message(STATUS "wasi-sdk sysroot  : ${WASI_SYSROOT}")
      message(STATUS "wasi-sdk C++ hdrs : ${WASI_CXX_INCLUDE}")
    endif()
  endif()
endif()
# ──────────────────────────────────────────────────────────────────────────────

add_executable(plugin plugin.cc)
target_include_directories(plugin PRIVATE "${PROXY_WASM_CPP_SDK_PATH}")

set_target_properties(plugin PROPERTIES
  OUTPUT_NAME "add_header_filter"
  SUFFIX      ".wasm"
  # -mexec-model=reactor : builds a WASI reactor instead of command (no main() required)
  # --export-all         : export all our ABI callbacks to the host
  # --export=malloc      : explicitly export malloc from wasi-libc since proxy-wasm relies on it
  # --export=free        : explicitly export free
  # --allow-undefined    : host imports resolved at runtime
  LINK_FLAGS  "-mexec-model=reactor -Wl,--export-all -Wl,--export=malloc -Wl,--export=free -Wl,--allow-undefined"
)

```

Compile the WebAssembly plugin using the WASI-SDK:

```bash
# 2. Configure using the p1 toolchain
cmake -S plugin -B build/plugin \
  -DCMAKE_TOOLCHAIN_FILE=$WASI_SDK_PATH/share/cmake/wasi-sdk-p1.cmake \
  -DPROXY_WASM_CPP_SDK_PATH=$(pwd)/.deps/proxy-wasm-cpp-sdk \
  -DCMAKE_BUILD_TYPE=Release -G Ninja

# 3. Build!
cmake --build build/plugin
```

## 3. Write the Native Host

Create a directory named `host`. The host initializes a WasmEdge virtual machine, loads the compiled WebAssembly filter, and simulates HTTP network traffic.

Create `host/main.cc`:

```cpp
// host/main.cc
//
// Minimal proxy-wasm host that demonstrates WasmEdge as the runtime backend.
//
// It:
//   1. Creates a WasmEdge VM through proxy-wasm-cpp-host's factory.
//   2. Loads the compiled add_header_filter.wasm plugin.
//   3. Simulates an HTTP exchange (request headers → response headers).
//   4. Prints the resulting response headers so you can see "x-powered-by:
//   WasmEdge".

#include <chrono>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>

// proxy-wasm-cpp-host public headers
#include "include/proxy-wasm/context.h"
#include "include/proxy-wasm/wasm.h"

// WasmEdge runtime factory (added by PR #193)
#include "include/proxy-wasm/wasmedge.h"

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

namespace {

using HeaderMap = std::vector<std::pair<std::string, std::string>>;

std::string readFile(const std::string &path) {
  std::ifstream f(path, std::ios::binary);
  if (!f) {
    std::cerr << "ERROR: Cannot open '" << path << "'\n";
    std::exit(1);
  }
  std::ostringstream buf;
  buf << f.rdbuf();
  return buf.str();
}

void printHeaders(const std::string &label, const HeaderMap &hdrs) {
  std::cout << "\n── " << label << " ──\n";
  for (auto &[k, v] : hdrs) {
    std::cout << "  " << k << ": " << v << "\n";
  }
}

// ── DemoContext
// ───────────────────────────────────────────────────────────────
//
// A concrete ContextBase that:
//   • stores simulated request and response header maps
//   • implements the subset of HeaderInterface actually called by a typical
//     HTTP filter (add/get/getSize/getPairs)
//   • prints plugin log lines to stdout

class DemoContext : public proxy_wasm::ContextBase {
public:
  DemoContext(proxy_wasm::WasmBase *wasm,
              const std::shared_ptr<proxy_wasm::PluginBase> &plugin)
      : proxy_wasm::ContextBase(wasm, plugin) {}

  // ── HeaderInterface overrides ─────────────────────────────────────────────

  proxy_wasm::WasmResult addHeaderMapValue(proxy_wasm::WasmHeaderMapType type,
                                           std::string_view key,
                                           std::string_view value) override {
    headerMap(type).emplace_back(key, value);
    return proxy_wasm::WasmResult::Ok;
  }

  proxy_wasm::WasmResult getHeaderMapValue(proxy_wasm::WasmHeaderMapType type,
                                           std::string_view key,
                                           std::string_view *result) override {
    for (auto &[k, v] : headerMap(type)) {
      if (k == key) {
        *result = v;
        return proxy_wasm::WasmResult::Ok;
      }
    }
    *result = {};
    return proxy_wasm::WasmResult::Ok;
  }

  proxy_wasm::WasmResult getHeaderMapPairs(proxy_wasm::WasmHeaderMapType type,
                                           proxy_wasm::Pairs *result) override {
    auto &map = headerMap(type);
    result->clear();
    for (auto &[k, v] : map)
      result->emplace_back(k, v);
    return proxy_wasm::WasmResult::Ok;
  }

  proxy_wasm::WasmResult
  setHeaderMapPairs(proxy_wasm::WasmHeaderMapType type,
                    const proxy_wasm::Pairs &pairs) override {
    auto &map = headerMap(type);
    map.clear();
    for (auto &[k, v] : pairs)
      map.emplace_back(k, v);
    return proxy_wasm::WasmResult::Ok;
  }

  proxy_wasm::WasmResult
  removeHeaderMapValue(proxy_wasm::WasmHeaderMapType type,
                       std::string_view key) override {
    auto &map = headerMap(type);
    map.erase(std::remove_if(map.begin(), map.end(),
                             [&](const auto &p) { return p.first == key; }),
              map.end());
    return proxy_wasm::WasmResult::Ok;
  }

  proxy_wasm::WasmResult
  replaceHeaderMapValue(proxy_wasm::WasmHeaderMapType type,
                        std::string_view key, std::string_view value) override {
    for (auto &[k, v] : headerMap(type)) {
      if (k == key) {
        v = value;
        return proxy_wasm::WasmResult::Ok;
      }
    }
    headerMap(type).emplace_back(key, value);
    return proxy_wasm::WasmResult::Ok;
  }

  proxy_wasm::WasmResult getHeaderMapSize(proxy_wasm::WasmHeaderMapType type,
                                          uint32_t *result) override {
    *result = static_cast<uint32_t>(headerMap(type).size());
    return proxy_wasm::WasmResult::Ok;
  }

  // ── GeneralInterface partial overrides ───────────────────────────────────

  proxy_wasm::WasmResult log(uint32_t level,
                             std::string_view message) override {
    const char *lvl = "INFO";
    if (level == 0)
      lvl = "TRACE";
    else if (level == 1)
      lvl = "DEBUG";
    else if (level == 3)
      lvl = "WARN";
    else if (level == 4)
      lvl = "ERROR";
    std::cout << "[" << lvl << "] " << message << "\n";
    return proxy_wasm::WasmResult::Ok;
  }

  uint64_t getCurrentTimeNanoseconds() override {
    return static_cast<uint64_t>(
        std::chrono::duration_cast<std::chrono::nanoseconds>(
            std::chrono::system_clock::now().time_since_epoch())
            .count());
  }

  // ── Header storage (public for the driver) ────────────────────────────────
  HeaderMap request_headers;
  HeaderMap response_headers;

private:
  HeaderMap &headerMap(proxy_wasm::WasmHeaderMapType type) {
    if (type == proxy_wasm::WasmHeaderMapType::RequestHeaders)
      return request_headers;
    return response_headers;
  }
};

// ── DemoWasmVmIntegration
// ──────────────────────────────────────────────────────
class DemoWasmVmIntegration : public proxy_wasm::WasmVmIntegration {
public:
  DemoWasmVmIntegration *clone() override {
    return new DemoWasmVmIntegration();
  }
  proxy_wasm::LogLevel getLogLevel() override {
    return proxy_wasm::LogLevel::trace;
  }
  void error(std::string_view message) override {
    std::cerr << "[WasmVm Error] " << message << std::endl;
  }
  void trace(std::string_view message) override {
    std::cout << "[WasmVm Trace] " << message << std::endl;
  }
  bool getNullVmFunction(std::string_view /*function_name*/,
                         bool /*returns_word*/, int /*number_of_arguments*/,
                         proxy_wasm::NullPlugin * /*plugin*/,
                         void * /*ptr_to_function_return*/) override {
    return false;
  }
};

// ── DemoWasm ─────────────────────────────────────────────────────────────────
//
// Extends WasmBase only to supply our DemoContext factory and VM integration.

class DemoWasm : public proxy_wasm::WasmBase {
public:
  DemoWasm(std::unique_ptr<proxy_wasm::WasmVm> vm, std::string_view vm_id)
      : proxy_wasm::WasmBase(std::move(vm), vm_id,
                             /*vm_configuration=*/"",
                             /*vm_key=*/"",
                             /*envs=*/{},
                             /*allowed_capabilities=*/{}) {
    wasm_vm()->integration().reset(new DemoWasmVmIntegration());
  }

  proxy_wasm::ContextBase *createRootContext(
      const std::shared_ptr<proxy_wasm::PluginBase> &plugin) override {
    auto *ctx = new DemoContext(this, plugin);
    demo_ctx_ = ctx;
    return ctx;
  }

  proxy_wasm::ContextBase *createContext(
      const std::shared_ptr<proxy_wasm::PluginBase> &plugin) override {
    return new DemoContext(this, plugin);
  }

  DemoContext *demo_ctx() const { return demo_ctx_; }

private:
  DemoContext *demo_ctx_{nullptr};
};

// ── DemoWasmHandle
// ────────────────────────────────────────────────────────────

class DemoWasmHandle : public proxy_wasm::WasmHandleBase {
public:
  explicit DemoWasmHandle(std::shared_ptr<proxy_wasm::WasmBase> wasm)
      : proxy_wasm::WasmHandleBase(std::move(wasm)) {}
};

} // anonymous namespace

// ────────────────────────────────────────────────────────────────────────────
// main
// ────────────────────────────────────────────────────────────────────────────

int main(int argc, char *argv[]) {
  if (argc < 2) {
    std::cerr << "Usage: " << argv[0] << " <path/to/add_header_filter.wasm>\n";
    return 1;
  }
  const std::string wasm_path = argv[1];

  std::cout << "==============================================\n";
  std::cout << " proxy-wasm + WasmEdge demo\n";
  std::cout << "==============================================\n\n";

  // 1. Read the compiled Wasm plugin from disk.
  std::string wasm_bytes = readFile(wasm_path);
  std::cout << "Loaded plugin: " << wasm_path << " (" << wasm_bytes.size()
            << " bytes)\n";

  // 2. Construct our DemoWasm host instance backed by WasmEdge.
  const std::string vm_id = "demo_vm";
  auto demo_wasm =
      std::make_shared<DemoWasm>(proxy_wasm::createWasmEdgeVm(), vm_id);
  std::cout << "Runtime:       WasmEdge ("
            << demo_wasm->wasm_vm()->getEngineName() << ")\n";

  // 3. Load and initialise the Wasm module.
  if (!demo_wasm->load(wasm_bytes, /*allow_precompiled=*/false)) {
    std::cerr << "ERROR: Failed to load Wasm module.\n";
    return 1;
  }
  if (!demo_wasm->initialize()) {
    std::cerr << "ERROR: Failed to initialize Wasm module.\n";
    return 1;
  }

  // 4. Create a PluginBase that carries metadata the Wasm plugin can query.
  const std::string root_id = "add_header_filter";
  auto plugin = std::make_shared<proxy_wasm::PluginBase>(
      /*name=*/"add_header_filter",
      /*root_id=*/root_id,
      /*vm_id=*/vm_id,
      /*engine=*/"wasmedge",
      /*plugin_configuration=*/"",
      /*fail_open=*/false,
      /*key=*/"");

  // 5. Start the root context (calls the plugin's proxy_on_vm_start /
  // proxy_on_configure).
  auto *root_ctx = demo_wasm->start(plugin);
  if (!root_ctx) {
    std::cerr << "ERROR: Failed to start root context.\n";
    return 1;
  }
  demo_wasm->configure(root_ctx, plugin);
  std::cout << "Root context created (root_id=\"" << root_id << "\")\n";

  // ── Simulate HTTP request / response ────────────────────────────────────

  // Grab the root context so we can seed the header maps.
  auto *ctx = demo_wasm->demo_ctx();
  ctx->request_headers = {
      {":method", "GET"},
      {":path", "/api/hello"},
      {":authority", "example.com"},
      {"user-agent", "curl/7.88.1"},
      {"accept", "*/*"},
  };
  ctx->response_headers = {
      {":status", "200"},
      {"content-type", "application/json"},
      {"content-length", "27"},
  };

  printHeaders("Request headers (before filter)", ctx->request_headers);
  printHeaders("Response headers (before filter)", ctx->response_headers);

  // 6. Run the HTTP filter lifecycle on the root context.
  //    (For proper stream contexts use WasmBase::createContext + callOnThread;
  //     running directly on the root context is sufficient for this demo.)
  std::cout << "\n── Running onRequestHeaders ──\n";
  root_ctx->onRequestHeaders(static_cast<uint32_t>(ctx->request_headers.size()),
                             /*end_of_stream=*/false);

  std::cout << "\n── Running onResponseHeaders ──\n";
  root_ctx->onResponseHeaders(
      static_cast<uint32_t>(ctx->response_headers.size()),
      /*end_of_stream=*/false);

  printHeaders("Response headers (after filter)", ctx->response_headers);

  std::cout << "\n==============================================\n";
  std::cout << " Demo complete!  Check 'x-powered-by: WasmEdge' above.\n";
  std::cout << "==============================================\n";

  return 0;
}
```

Create `host/CMakeLists.txt`:

```bash
cmake_minimum_required(VERSION 3.14)
project(proxy_wasm_wasmedge_demo CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ── Required paths (pass via -D on the cmake command line) ────────────────────
#   PROXY_WASM_CPP_HOST_PATH  – root of the proxy-wasm-cpp-host clone
#   WASMEDGE_INSTALL_PATH     – WasmEdge install prefix (default: ~/.wasmedge)

if(NOT DEFINED PROXY_WASM_CPP_HOST_PATH)
  message(FATAL_ERROR
    "Set PROXY_WASM_CPP_HOST_PATH to your proxy-wasm-cpp-host source tree.\n"
    "  cmake -DPROXY_WASM_CPP_HOST_PATH=... .")
endif()

if(NOT DEFINED PROXY_WASM_CPP_SDK_PATH)
  set(PROXY_WASM_CPP_SDK_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../.deps/proxy-wasm-cpp-sdk")
endif()

if(NOT DEFINED WASMEDGE_INSTALL_PATH)
  set(WASMEDGE_INSTALL_PATH "$ENV{HOME}/.wasmedge")
endif()

set(HOST_ROOT "${PROXY_WASM_CPP_HOST_PATH}")

# ── WasmEdge shared library ───────────────────────────────────────────────────
find_library(WASMEDGE_LIB
  NAMES wasmedge
  HINTS "${WASMEDGE_INSTALL_PATH}/lib"
  REQUIRED)

message(STATUS "WasmEdge library : ${WASMEDGE_LIB}")

# ── OpenSSL ───────────────────────────────────────────────────────────────────
find_package(OpenSSL REQUIRED)
message(STATUS "OpenSSL include : ${OPENSSL_INCLUDE_DIR}")
message(STATUS "OpenSSL library : ${OPENSSL_LIBRARIES}")

# ── Abseil (required by proxy-wasm-cpp-host for absl::cleanup) ───────────────
if(NOT DEFINED ABSL_ROOT_DIR)
  # Try common Homebrew locations first
  if(EXISTS "/opt/homebrew/opt/abseil")
    set(ABSL_ROOT_DIR "/opt/homebrew/opt/abseil")
  elseif(EXISTS "/usr/local/opt/abseil")
    set(ABSL_ROOT_DIR "/usr/local/opt/abseil")
  endif()
endif()
if(DEFINED ABSL_ROOT_DIR)
  list(PREPEND CMAKE_PREFIX_PATH "${ABSL_ROOT_DIR}")
endif()
find_package(absl REQUIRED)
message(STATUS "Abseil include : ${ABSL_ROOT_DIR}/include")

# ── proxy-wasm-cpp-host sources ───────────────────────────────────────────────
# The host library is built as part of the main project here so that we can
# enable the WasmEdge backend.  In a real project you would add the host as a
# CMake subdirectory or consume its installed targets.

set(HOST_SOURCES
  # Core base library
  "${HOST_ROOT}/src/bytecode_util.cc"
  "${HOST_ROOT}/src/context.cc"
  "${HOST_ROOT}/src/exports.cc"
  "${HOST_ROOT}/src/hash.cc"
  "${HOST_ROOT}/src/pairs_util.cc"
  "${HOST_ROOT}/src/shared_data.cc"
  "${HOST_ROOT}/src/shared_queue.cc"
  "${HOST_ROOT}/src/signature_util.cc"
  "${HOST_ROOT}/src/vm_id_handle.cc"
  "${HOST_ROOT}/src/wasm.cc"
  # Null VM (needed for NullIntegration base class)
  "${HOST_ROOT}/src/null/null.cc"
  "${HOST_ROOT}/src/null/null_plugin.cc"
  "${HOST_ROOT}/src/null/null_vm.cc"
  # WasmEdge runtime backend (the whole point of the demo)
  "${HOST_ROOT}/src/wasmedge/wasmedge.cc"
)

add_library(proxy_wasm_host STATIC ${HOST_SOURCES})

target_include_directories(proxy_wasm_host PUBLIC
  "${HOST_ROOT}"
  "${HOST_ROOT}/include"
  "${PROXY_WASM_CPP_SDK_PATH}"
  "${WASMEDGE_INSTALL_PATH}/include"
  "${OPENSSL_INCLUDE_DIR}"
)
target_link_libraries(proxy_wasm_host PUBLIC
  "${WASMEDGE_LIB}"
  OpenSSL::SSL
  OpenSSL::Crypto
  absl::cleanup
  absl::base
  absl::strings
)
target_compile_definitions(proxy_wasm_host PUBLIC WITH_WASMEDGE=1)

# ── Demo executable ───────────────────────────────────────────────────────────
add_executable(demo main.cc)
target_link_libraries(demo PRIVATE proxy_wasm_host)
target_include_directories(demo PRIVATE
  "${HOST_ROOT}"
  "${HOST_ROOT}/include"
  "${PROXY_WASM_CPP_SDK_PATH}"
  "${WASMEDGE_INSTALL_PATH}/include"
  "${OPENSSL_INCLUDE_DIR}"
)
```

Compile the Native Host:

```bash
cmake -S host -B build/host \
  -DPROXY_WASM_CPP_HOST_PATH=$(pwd)/.deps/proxy-wasm-cpp-host \
  -DWASMEDGE_INSTALL_PATH=$HOME/.wasmedge \
  -DCMAKE_BUILD_TYPE=Release -G Ninja

cmake --build build/host
```

## 4. Execution

Run the compiled native host and pass it the WebAssembly plugin. Ensure the WasmEdge library is in your path.

```bash
# For macOS use DYLD_LIBRARY_PATH, for Linux use LD_LIBRARY_PATH
LD_LIBRARY_PATH=$HOME/.wasmedge/lib ./build/host/demo ./build/plugin/add_header_filter.wasm
```

## Expected Output

Upon successful execution, the host will load the WebAssembly filter and simulate network traffic. The output will explicitly indicate that the plugin injected the custom x-powered-by: WasmEdge header:

```
Loaded plugin: .../add_header_filter.wasm
Runtime:       WasmEdge (wasmedge)

── Request headers (before filter) ──
  :method: GET
  :path: /api/hello

── Response headers (before filter) ──
  :status: 200

── Running onResponseHeaders ──
[INFO] [AddHeaderFilter] Injected 'x-powered-by: WasmEdge' into response.

── Response headers (after filter) ──
  :status: 200
  x-powered-by: WasmEdge
```

Congrats! You have now compiled and run a Proxy-Wasm filter natively with WasmEdge. Now you have the building blocks to develop high-performance WebAssembly plugins that can inspect, route, and securely mutate network traffic across your cloud-native infrastructure.
