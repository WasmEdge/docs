"use strict";(self.webpackChunkbook=self.webpackChunkbook||[]).push([[5520],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>g});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),d=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},m=function(e){var t=d(e.components);return a.createElement(l.Provider,{value:t},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,l=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),c=d(n),p=r,g=c["".concat(l,".").concat(p)]||c[p]||u[p]||s;return n?a.createElement(g,i(i({ref:t},m),{},{components:n})):a.createElement(g,i({ref:t},m))}));function g(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,i=new Array(s);i[0]=p;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o[c]="string"==typeof e?e:r,i[1]=o;for(var d=2;d<s;d++)i[d]=n[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},1785:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>c,frontMatter:()=>s,metadata:()=>o,toc:()=>d});var a=n(7462),r=(n(7294),n(3905));const s={sidebar_position:2},i="4.2 Use WasmEdge Library",o={unversionedId:"embed/c/library",id:"embed/c/library",title:"4.2 Use WasmEdge Library",description:"When programming with WasmEdge C API, developers should include the required headers and link with the WasmEdge Library.",source:"@site/docs/embed/c/library.md",sourceDirName:"embed/c",slug:"/embed/c/library",permalink:"/book/embed/c/library",draft:!1,editUrl:"https://github.com/alabulei1/book/docs/embed/c/library.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"embedSidebar",previous:{title:"4.1 WasmEdge C SDK Introduction",permalink:"/book/embed/c/intro"},next:{title:"4.3 Host Functions",permalink:"/book/embed/c/host_function"}},l={},d=[{value:"Link with WasmEdge Shared Library",id:"link-with-wasmedge-shared-library",level:2},{value:"Link with WasmEdge Static Library",id:"link-with-wasmedge-static-library",level:2}],m={toc:d};function c(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"42-use-wasmedge-library"},"4.2 Use WasmEdge Library"),(0,r.kt)("h1",{id:"use-the-wasmedge-library"},"Use the WasmEdge Library"),(0,r.kt)("p",null,"When programming with WasmEdge C API, developers should include the required headers and link with the WasmEdge Library.\nBesides ",(0,r.kt)("a",{parentName:"p",href:"/book/develop/build-and-run/install"},"install WasmEdge")," with the WasmEdge shared library, developers can also ",(0,r.kt)("a",{parentName:"p",href:"/book/contribute/source/build_from_src"},"build WasmEdge")," to generate the WasmEdge static library."),(0,r.kt)("p",null,"Assume the example ",(0,r.kt)("inlineCode",{parentName:"p"},"test.c"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-c"},'#include <stdio.h>\n#include <wasmedge/wasmedge.h>\n\n/* Host function body definition. */\nWasmEdge_Result Add(void *Data,\n                    const WasmEdge_CallingFrameContext *CallFrameCxt,\n                    const WasmEdge_Value *In, WasmEdge_Value *Out) {\n  int32_t Val1 = WasmEdge_ValueGetI32(In[0]);\n  int32_t Val2 = WasmEdge_ValueGetI32(In[1]);\n  printf("Host function \\"Add\\": %d + %d\\n", Val1, Val2);\n  Out[0] = WasmEdge_ValueGenI32(Val1 + Val2);\n  return WasmEdge_Result_Success;\n}\n\nint main() {\n  /* Create the VM context. */\n  WasmEdge_VMContext *VMCxt = WasmEdge_VMCreate(NULL, NULL);\n\n  /* The WASM module buffer. */\n  uint8_t WASM[] = {/* WASM header */\n                    0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00,\n                    /* Type section */\n                    0x01, 0x07, 0x01,\n                    /* function type {i32, i32} -> {i32} */\n                    0x60, 0x02, 0x7F, 0x7F, 0x01, 0x7F,\n                    /* Import section */\n                    0x02, 0x13, 0x01,\n                    /* module name: "extern" */\n                    0x06, 0x65, 0x78, 0x74, 0x65, 0x72, 0x6E,\n                    /* extern name: "func-add" */\n                    0x08, 0x66, 0x75, 0x6E, 0x63, 0x2D, 0x61, 0x64, 0x64,\n                    /* import desc: func 0 */\n                    0x00, 0x00,\n                    /* Function section */\n                    0x03, 0x02, 0x01, 0x00,\n                    /* Export section */\n                    0x07, 0x0A, 0x01,\n                    /* export name: "addTwo" */\n                    0x06, 0x61, 0x64, 0x64, 0x54, 0x77, 0x6F,\n                    /* export desc: func 0 */\n                    0x00, 0x01,\n                    /* Code section */\n                    0x0A, 0x0A, 0x01,\n                    /* code body */\n                    0x08, 0x00, 0x20, 0x00, 0x20, 0x01, 0x10, 0x00, 0x0B};\n\n  /* Create the module instance. */\n  WasmEdge_String ExportName = WasmEdge_StringCreateByCString("extern");\n  WasmEdge_ModuleInstanceContext *HostModCxt =\n      WasmEdge_ModuleInstanceCreate(ExportName);\n  enum WasmEdge_ValType ParamList[2] = {WasmEdge_ValType_I32,\n                                        WasmEdge_ValType_I32};\n  enum WasmEdge_ValType ReturnList[1] = {WasmEdge_ValType_I32};\n  WasmEdge_FunctionTypeContext *HostFType =\n      WasmEdge_FunctionTypeCreate(ParamList, 2, ReturnList, 1);\n  WasmEdge_FunctionInstanceContext *HostFunc =\n      WasmEdge_FunctionInstanceCreate(HostFType, Add, NULL, 0);\n  WasmEdge_FunctionTypeDelete(HostFType);\n  WasmEdge_String HostFuncName = WasmEdge_StringCreateByCString("func-add");\n  WasmEdge_ModuleInstanceAddFunction(HostModCxt, HostFuncName, HostFunc);\n  WasmEdge_StringDelete(HostFuncName);\n\n  WasmEdge_VMRegisterModuleFromImport(VMCxt, HostModCxt);\n\n  /* The parameters and returns arrays. */\n  WasmEdge_Value Params[2] = {WasmEdge_ValueGenI32(1234),\n                              WasmEdge_ValueGenI32(5678)};\n  WasmEdge_Value Returns[1];\n  /* Function name. */\n  WasmEdge_String FuncName = WasmEdge_StringCreateByCString("addTwo");\n  /* Run the WASM function from file. */\n  WasmEdge_Result Res = WasmEdge_VMRunWasmFromBuffer(\n      VMCxt, WASM, sizeof(WASM), FuncName, Params, 2, Returns, 1);\n\n  if (WasmEdge_ResultOK(Res)) {\n    printf("Get the result: %d\\n", WasmEdge_ValueGetI32(Returns[0]));\n  } else {\n    printf("Error message: %s\\n", WasmEdge_ResultGetMessage(Res));\n  }\n\n  /* Resources deallocations. */\n  WasmEdge_VMDelete(VMCxt);\n  WasmEdge_StringDelete(FuncName);\n  WasmEdge_ModuleInstanceDelete(HostModCxt);\n  return 0;\n}\n')),(0,r.kt)("p",null,"This example will execute a WASM which call into a host function to add 2 numbers."),(0,r.kt)("h2",{id:"link-with-wasmedge-shared-library"},"Link with WasmEdge Shared Library"),(0,r.kt)("p",null,"To link the executable with the WasmEdge shared library is easy. Just compile the example file after installation of WasmEdge."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'$ gcc test.c -lwasmedge -o test\n$ ./test\nHost function "Add": 1234 + 5678\nGet the result: 6912\n')),(0,r.kt)("h2",{id:"link-with-wasmedge-static-library"},"Link with WasmEdge Static Library"),(0,r.kt)("p",null,"For preparing the WasmEdge static library, developers should ",(0,r.kt)("a",{parentName:"p",href:"/book/contribute/source/build_from_src#cmake-building-options"},"build WasmEdge from source")," with the options:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"# Recommend to use the `wasmedge/wasmedge:latest` docker image. This will provide the required packages.\n# In the WasmEdge source directory\ncmake -Bbuild -GNinja -DCMAKE_BUILD_TYPE=Release -DWASMEDGE_LINK_LLVM_STATIC=ON -DWASMEDGE_BUILD_SHARED_LIB=Off -DWASMEDGE_BUILD_STATIC_LIB=On -DWASMEDGE_LINK_TOOLS_STATIC=On -DWASMEDGE_BUILD_PLUGINS=Off\ncmake --build build\ncmake --install build\n")),(0,r.kt)("p",null,"The cmake option ",(0,r.kt)("inlineCode",{parentName:"p"},"-DWASMEDGE_LINK_LLVM_STATIC=ON")," will turn on the static library building, and the ",(0,r.kt)("inlineCode",{parentName:"p"},"-DWASMEDGE_BUILD_SHARED_LIB=Off")," will turn off the shared library building."),(0,r.kt)("p",null,"After installation, developers can compile the example file:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'# Note: only the Linux platforms need the `-lrt`. The MacOS platforms not need this linker flag.\n$ gcc test.c -lwasmedge -lrt -ldl -pthread -lm -lstdc++ -o test\n$ ./test\nHost function "Add": 1234 + 5678\nGet the result: 6912\n')))}c.isMDXComponent=!0}}]);