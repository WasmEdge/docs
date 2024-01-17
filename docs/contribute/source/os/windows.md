---
sidebar_position: 3
---

# Build on Windows 10

You can also find the details [here](https://github.com/WasmEdge/WasmEdge/blob/master/.github/workflows/reusable-build-on-windows.yml#L37-L48).

## Get Source Code

```bash
git clone https://github.com/WasmEdge/WasmEdge.git
cd WasmEdge
```

## Requirements and Dependencies

WasmEdge requires LLVM 16 and you may need to install these following dependencies by yourself.

- [Chocolatey](https://chocolatey.org/install), we use it to install `cmake`, `ninja`, and `vswhere`.
- [Windows SDK 19041](https://blogs.windows.com/windowsdeveloper/2020/05/12/start-developing-on-windows-10-version-2004-today/)
- LLVM 16.0.6, download the pre-built files [here](https://github.com/WasmEdge/llvm-windows/releases) or you can just follow the `instructions/commands` to download automatically.

<!-- prettier-ignore -->
:::note
If you use the community version of Visual Studio, you may encounter errors like: `ninja: error: 'C:/Program Files/Microsoft Visual Studio/2022/Enterprise/DIA SDK/lib/amd64/diaguids.lib', needed by 'test/aot/wasmedgeAOTCoreTests.exe', missing and no known rule to make it`. You need to manually open the file `LLVM-16.0.6-win64/lib/cmake/llvm/LLVMExports.cmake`, search for the only occurrence of `Enterprise` and change it to `Community`. See [this issue](https://github.com/WasmEdge/WasmEdge/issues/1290#issuecomment-1056784554) for details.
:::

```powershell
# Install the required tools
choco install cmake ninja vswhere

$vsPath = (vswhere -latest -property installationPath)
# If vswhere.exe is not in PATH, try the following instead.
# $vsPath = (&"C:\Program Files (x86)\Microsoft Visual Studio\Installer\vswhere.exe" -latest -property installationPath)

Import-Module (Join-Path $vsPath "Common7\Tools\Microsoft.VisualStudio.DevShell.dll")
Enter-VsDevShell -VsInstallPath $vsPath -SkipAutomaticLocation -DevCmdArguments "-arch=x64 -host_arch=x64 -winsdk=10.0.19041.0"

# Download our pre-built LLVM 16 binary
$llvm = "LLVM-16.0.6-win64-MultiThreadedDLL.zip"
curl -sLO https://github.com/WasmEdge/llvm-windows/releases/download/llvmorg-16.0.6/LLVM-16.0.6-win64-MultiThreadedDLL.zip -o $llvm
Expand-Archive -Path $llvm

# Set LLVM environment
$llvm_dir = "$pwd\LLVM-16.0.6-win64-MultiThreadedDLL\LLVM-16.0.6-win64\lib\cmake\llvm"
```

## Build WasmEdge

On Windows, either Clang-cl or MSVC can be used to build WasmEdge. To use MSVC, simply comment out the two lines that set the environment variables `CC` and `CXX`.

```powershell
$vsPath = (vswhere -latest -property installationPath)
Import-Module (Join-Path $vsPath "Common7\Tools\Microsoft.VisualStudio.DevShell.dll")
Enter-VsDevShell -VsInstallPath $vsPath -SkipAutomaticLocation -DevCmdArguments "-arch=x64 -host_arch=x64 -winsdk=10.0.19041.0"
# If you would like to use MSVC, and want to use a specific version of MSVC, set the arg `vcvars_ver` like the following.
# Enter-VsDevShell -VsInstallPath $vsPath -SkipAutomaticLocation -DevCmdArguments "-arch=x64 -host_arch=x64 -winsdk=10.0.19041.0 -vcvars_ver=14.34.31933"

# Set LLVM path according to the download location
$llvm_dir = "$pwd\LLVM-16.0.6-win64-MultiThreadedDLL\LLVM-16.0.6-win64\lib\cmake\llvm"

# Use clang-cl as the compiler.
# Comment out the following two lines to use MSVC.
$Env:CC = "clang-cl"
$Env:CXX = "clang-cl"

cmake -Bbuild -GNinja -DCMAKE_SYSTEM_VERSION=10.0.19041.0 -DCMAKE_MSVC_RUNTIME_LIBRARY=MultiThreadedDLL "-DLLVM_DIR=$llvm_dir" -DWASMEDGE_BUILD_TESTS=ON -DWASMEDGE_BUILD_PACKAGE="ZIP" .
cmake --build build
```

## Run Tests

The following tests are available only when the build option `WASMEDGE_BUILD_TESTS` was set to `ON`.

Users can use these tests to verify the correctness of WasmEdge binaries.

```powershell
$Env:PATH += ";$pwd\build\lib\api"
cd build
ctest --output-on-failure
cd -
```
