"use strict";(self.webpackChunkbook=self.webpackChunkbook||[]).push([[5470],{3905:(e,t,a)=>{a.d(t,{Zo:()=>m,kt:()=>g});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var d=r.createContext({}),l=function(e){var t=r.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},m=function(e){var t=l(e.components);return r.createElement(d.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,d=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),u=l(a),p=n,g=u["".concat(d,".").concat(p)]||u[p]||c[p]||o;return a?r.createElement(g,i(i({ref:t},m),{},{components:a})):r.createElement(g,i({ref:t},m))}));function g(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,i=new Array(o);i[0]=p;var s={};for(var d in t)hasOwnProperty.call(t,d)&&(s[d]=t[d]);s.originalType=e,s[u]="string"==typeof e?e:n,i[1]=s;for(var l=2;l<o;l++)i[l]=a[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}p.displayName="MDXCreateElement"},4233:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var r=a(7462),n=(a(7294),a(3905));const o={sidebar_position:1,displayed_sidebar:"embedSidebar"},i="Guide for Embedding Wasm functions",s={unversionedId:"embed-guide/overview",id:"embed-guide/overview",title:"Guide for Embedding Wasm functions",description:"As we mentioned before, the most important use case for WasmEdge is to safely execute user-defined or community-contributed code as plug-ins in a software product. It enables third-party developers, vendors, suppliers, and community members to extend and customize the software product.",source:"@site/docs/embed-guide/overview.md",sourceDirName:"embed-guide",slug:"/embed-guide/overview",permalink:"/book/zh-Hans/embed-guide/overview",draft:!1,editUrl:"https://github.com/alabulei1/book/docs/embed-guide/overview.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,displayed_sidebar:"embedSidebar"},sidebar:"embedSidebar",next:{title:"Quick Start",permalink:"/book/zh-Hans/category/quick-start"}},d={},l=[],m={toc:l};function u(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"guide-for-embedding-wasm-functions"},"Guide for Embedding Wasm functions"),(0,n.kt)("p",null,"As we mentioned before, the most important use case for WasmEdge is to safely execute user-defined or community-contributed code as plug-ins in a software product. It enables third-party developers, vendors, suppliers, and community members to extend and customize the software product."),(0,n.kt)("p",null,"We could use WasmEdge as a standalone container and deploy WasmEdge using the existing containers tools. The other way is to use WasmEdge as an embedded runtime and manage WasmEdge using the host applications."),(0,n.kt)("p",null,"WasmEdge provides SDKs for various programming languages. The WasmEdge library allows developers to embed the WasmEdge into their host applications, so that the WebAssembly applications can be executed in the WasmEdge sandbox safely. Furthermore, developers can implement the host functions for the extensions with the WasmEdge library."),(0,n.kt)("p",null,"In this section, we will walk you through how to embed WasmEdge in different languages. "),(0,n.kt)("p",null,"We will cover the following content:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"../category/quick-start"},"Quick Start")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"../category/passing-complex-data"},"Passing complex data")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"./witc"},"Developing components using witc")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"../category/wasmedge-c-api"},"Embed WasmEdge in C/C++")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"../category/wasmedge-rust-sdk"},"Embed WasmEdge in Rust")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"../category/wasmedge-go-sdk"},"Embed WasmEdge in Go")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"../category/wasmedge-java-sdk"},"Embed WasmEdge in Java")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"../category/wasmedge-python-sdk"},"Embed WasmEdge in Python")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"../category/wasmedge-use-cases"},"Use cases"))),(0,n.kt)("p",null,"Besides this, we also have two more guides for developing Wasm apps and contributing to WasmEdge."),(0,n.kt)("p",null,"If you find some issues or have any feedback, you could reach out to us via the following ways."),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://discord.gg/U4B5sFTkFc"},"Discord Chat")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/WasmEdge/WasmEdge/issues"},"Create a GitHub issue for technical support")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/WasmEdge/WasmEdge/discussions"},"Submit a GitHub discussion")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://twitter.com/realwasmedge"},"Follow @realwasmedge on Twitter"))))}u.isMDXComponent=!0}}]);