"use strict";(self.webpackChunkbook=self.webpackChunkbook||[]).push([[4686],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>N});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),s=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},k=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),m=s(n),k=r,N=m["".concat(p,".").concat(k)]||m[k]||u[k]||l;return n?a.createElement(N,i(i({ref:t},d),{},{components:n})):a.createElement(N,i({ref:t},d))}));function N(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,i=new Array(l);i[0]=k;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o[m]="string"==typeof e?e:r,i[1]=o;for(var s=2;s<l;s++)i[s]=n[s];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}k.displayName="MDXCreateElement"},7089:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>m,frontMatter:()=>l,metadata:()=>o,toc:()=>s});var a=n(7462),r=(n(7294),n(3905));const l={sidebar_position:1},i="2.2.1  Standard WebAssembly proposals",o={unversionedId:"develop-guide/wasmedge/extensions/proposals",id:"develop-guide/wasmedge/extensions/proposals",title:"2.2.1  Standard WebAssembly proposals",description:"WebAssembly proposals",source:"@site/docs/develop-guide/wasmedge/extensions/proposals.md",sourceDirName:"develop-guide/wasmedge/extensions",slug:"/develop-guide/wasmedge/extensions/proposals",permalink:"/book/develop-guide/wasmedge/extensions/proposals",draft:!1,editUrl:"https://github.com/alabulei1/book/docs/develop-guide/wasmedge/extensions/proposals.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"developSidebar",previous:{title:"2.2 WasmEdge Extensions",permalink:"/book/category/22-wasmedge-extensions"},next:{title:"2.2.2 WasmEdge extensions",permalink:"/book/develop-guide/wasmedge/extensions/unique_extensions"}},p={},s=[{value:"WebAssembly proposals",id:"webassembly-proposals",level:2},{value:"WASI proposals",id:"wasi-proposals",level:2}],d={toc:s};function m(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"221--standard-webassembly-proposals"},"2.2.1  Standard WebAssembly proposals"),(0,r.kt)("h2",{id:"webassembly-proposals"},"WebAssembly proposals"),(0,r.kt)("p",null,"WasmEdge supports the following ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/WebAssembly/proposals"},"WebAssembly proposals"),". Those proposals are likely to become official WebAssembly specifications in the future."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Proposal"),(0,r.kt)("th",{parentName:"tr",align:null},"WasmEdge CLI flag"),(0,r.kt)("th",{parentName:"tr",align:null},"WasmEdge C API enumeration"),(0,r.kt)("th",{parentName:"tr",align:null},"Default turning on"),(0,r.kt)("th",{parentName:"tr",align:null},"Interpreter mode"),(0,r.kt)("th",{parentName:"tr",align:null},"AOT mode"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/mutable-global"},"Import/Export of Mutable Globals")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--disable-import-export-mut-globals")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"WasmEdge_Proposal_ImportExportMutGlobals")),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.8.2"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/nontrapping-float-to-int-conversions"},"Non-trapping float-to-int conversions")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--disable-non-trap-float-to-int")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"WasmEdge_Proposal_NonTrapFloatToIntConversions")),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.8.2"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/sign-extension-ops"},"Sign-extension operators")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--disable-sign-extension-operators")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"WasmEdge_Proposal_SignExtensionOperators")),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.8.2"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/multi-value"},"Multi-value")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--disable-multi-value")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"WasmEdge_Proposal_MultiValue")),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.8.2"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/reference-types"},"Reference Types")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--disable-reference-types")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"WasmEdge_Proposal_ReferenceTypes")),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.8.2"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/bulk-memory-operations"},"Bulk memory operations")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--disable-bulk-memory")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"WasmEdge_Proposal_BulkMemoryOperations")),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.8.2"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/webassembly/simd"},"Fixed-width SIMD")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--disable-simd")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"WasmEdge_Proposal_SIMD")),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.9.0"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.8.2"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.8.2"),")")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/tail-call"},"Tail call")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--enable-tail-call")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"WasmEdge_Proposal_TailCall")),(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.10.0"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.10.0"),")")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/multi-memory"},"Multiple memories")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--enable-multi-memory")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"WasmEdge_Proposal_MultiMemories")),(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.9.1"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.9.1"),")")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/extended-const"},"Extended Constant Expressions")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--enable-extended-const")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"WasmEdge_Proposal_ExtendedConst")),(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.10.0"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.10.0"),")")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/webassembly/threads"},"Threads")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--enable-threads")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"WasmEdge_Proposal_Threads")),(0,r.kt)("td",{parentName:"tr",align:null}),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.10.1"),")"),(0,r.kt)("td",{parentName:"tr",align:null},"\u2713 (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.10.1"),")")))),(0,r.kt)("p",null,"The following proposals is under development and may be supported in the future:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/WebAssembly/component-model"},"Component Model")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/WebAssembly/exception-handling"},"Exception handling")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/WebAssembly/gc"},"Garbage collection")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/WebAssembly/wasm-c-api"},"WebAssembly C and C++ API"))),(0,r.kt)("h2",{id:"wasi-proposals"},"WASI proposals"),(0,r.kt)("p",null,"WasmEdge implements the following ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/WebAssembly/WASI/blob/main/Proposals.md"},"WASI proposals"),"."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Proposal"),(0,r.kt)("th",{parentName:"tr",align:null},"Platforms"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/wasi-sockets"},"Sockets")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"x86_64 Linux"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"aarch64 Linux")," (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.10.0"),")")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/wasi-crypto"},"Crypto")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"x86_64 Linux"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"aarch64 Linux")," (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.10.1"),")")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/WebAssembly/wasi-nn"},"Machine Learning (wasi-nn)")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"x86_64 Linux"),", OpenVINO (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.10.1"),"), PyTorch (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.11.1"),"), and TensorFlow-Lite (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.11.2"),") backends")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"https://github.com/proxy-wasm/spec"},"proxy-wasm")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"x86_64 Linux (Interpreter only)")," (since ",(0,r.kt)("inlineCode",{parentName:"td"},"0.8.2"),")")))),(0,r.kt)("p",null,"The following proposals is under development and may be supported in the future:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"WebAssembly GC Proposal")))}m.isMDXComponent=!0}}]);