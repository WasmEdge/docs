---
sidebar_position: 2
---

## Using Plug-ins to Extend the Runtime in C

The WasmEdge plug-ins are the shared libraries to provide the WasmEdge runtime to load and create host module instances. With the plug-ins, the WasmEdge runtime can be extended more easily.

## Loading Plug-ins from Paths

Developers can start using WasmEdge plug-ins by loading them from specific paths. To load plug-ins from the default paths, the following API can be used:

```toml
impl PluginManager
pub fn load(path: Option<&Path>) -> WasmEdgeResult<()>
```

- The default plug-in paths will be used if the path is not given.

  - The path specified in the `WASMEDGE_PLUGIN_PATH` environment variable.
  - The `../plugin/` directory relative to the WasmEdge installation path.
  - The `./wasmedge/` directory under the library path if WasmEdge is installed in the `/usr` directory.

- If the path is given, then

  - If the path is pointing at a file, then it indicates that a single plug-in will be loaded from the file.
  - If the path is pointing at a directory, then the method will load plug-ins from the files.

To get the names of all loaded plug-ins as returns -

```toml
pub fn names() -> Vec<String>
```

<!-- prettier-ignore -->
:::note
`path` - A path to a plug-in file or a directory holding plug-in files. If `None`, then the default plug-in path will be used.
:::

## Listing Loaded Plug-ins

Once plug-ins are loaded, developers can list the loaded plug-in names using the following approach:

```toml
pub fn names() -> Vec<String>
```

## Getting Plug-in Context by Name

Developers can get the plug-in context by its name using the following method:

```toml
pub fn find(name: impl AsRef<str>) -> Option<Plugin>
```

Here `name` is the name of the target plug-in.

## Getting Module Instances from Plug-ins

With the plug-in context, developers can get module instances by providing the module name:

```toml
pub fn mod_names(&self) -> Vec<String>
```

There may be several plug-ins in the default plug-in paths if users [installed WasmEdge plug-ins by the installer](/contribute/installer.md#plugins).

Before using the plug-ins, developers should [Loading Plug-ins from Paths](#loading-plug-ins-from-paths).

## Plug-in Module Instance

To initialize the `wasmedge_process` plug-in module instance with the parameters -

```toml
pub fn init_wasmedge_process(allowed_cmds: Option<Vec<&str>>, allowed: bool)
```

Here, `allowed_cmds` is A white list of commands and `allowed` determines if wasmedge_process is allowed to execute all commands on the white list.
