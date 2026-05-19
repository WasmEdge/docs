---
sidebar_position: 3
---

# 在 Windows 10 上建置

您也可以在[此處](https://github.com/WasmEdge/WasmEdge/blob/master/.github/workflows/reusable-build-on-windows.yml#L37-L48) 找到詳細資訊。

## 取得原始碼

```bash
git clone https://github.com/WasmEdge/WasmEdge.git
cd WasmEdge
```

## 需求與相依套件

WasmEdge 需要 LLVM 16,您可能需要自行安裝以下相依套件。

- [Chocolatey](https://chocolatey.org/install),我們使用它來安裝 `cmake`、`ninja` 與 `vswhere`。
- [Windows SDK 19041](https://blogs.windows.com/windowsdeveloper/2020/05/12/start-developing-on-windows-10-version-2004-today/)
- LLVM 16.0.6,在[此處](https://github.com/WasmEdge/llvm-windows/releases) 下載預建檔案,或者您可以直接遵循 `instructions/commands` 自動下載。

<!-- prettier-ignore -->
:::note
如果您使用社群版 Visual Studio,可能會遇到下列錯誤:`ninja: error: 'C:/Program Files/Microsoft Visual Studio/2022/Enterprise/DIA SDK/lib/amd64/diaguids.lib', needed by 'test/aot/wasmedgeAOTCoreTests.exe', missing and no known rule to make it`。您需要手動開啟檔案 `LLVM-16.0.6-win64/lib/cmake/llvm/LLVMExports.cmake`,搜尋唯一出現的 `Enterprise` 並將其變更為 `Community`。詳情請參閱[此議題](https://github.com/WasmEdge/WasmEdge/issues/1290#issuecomment-1056784554)。
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
Invoke-WebRequest -Uri https://github.com/WasmEdge/llvm-windows/releases/download/llvmorg-16.0.6/LLVM-16.0.6-win64-MultiThreadedDLL.zip -OutFile $llvm
Expand-Archive -Path $llvm

# Set LLVM environment
$llvm_dir = "$pwd\LLVM-16.0.6-win64-MultiThreadedDLL\LLVM-16.0.6-win64\lib\cmake\llvm"
```

## 建置 WasmEdge

在 Windows 上,可以使用 Clang-cl 或 MSVC 來建置 WasmEdge。要使用 MSVC,只需註解設定環境變數 `CC` 與 `CXX` 的兩行即可。

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

## 執行測試

下列測試僅在建置選項 `WASMEDGE_BUILD_TESTS` 設為 `ON` 時可用。

使用者可使用這些測試來驗證 WasmEdge 執行檔的正確性。

```powershell
$Env:PATH += ";$pwd\build\lib\api"
cd build
ctest --output-on-failure
cd -
```
