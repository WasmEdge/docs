"use strict";(self.webpackChunkbook=self.webpackChunkbook||[]).push([[9887],{3905:(e,n,o)=>{o.d(n,{Zo:()=>m,kt:()=>g});var t=o(7294);function a(e,n,o){return n in e?Object.defineProperty(e,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[n]=o,e}function l(e,n){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),o.push.apply(o,t)}return o}function r(e){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?l(Object(o),!0).forEach((function(n){a(e,n,o[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):l(Object(o)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(o,n))}))}return e}function i(e,n){if(null==e)return{};var o,t,a=function(e,n){if(null==e)return{};var o,t,a={},l=Object.keys(e);for(t=0;t<l.length;t++)o=l[t],n.indexOf(o)>=0||(a[o]=e[o]);return a}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(t=0;t<l.length;t++)o=l[t],n.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(a[o]=e[o])}return a}var s=t.createContext({}),p=function(e){var n=t.useContext(s),o=n;return e&&(o="function"==typeof e?e(n):r(r({},n),e)),o},m=function(e){var n=p(e.components);return t.createElement(s.Provider,{value:n},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},c=t.forwardRef((function(e,n){var o=e.components,a=e.mdxType,l=e.originalType,s=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),d=p(o),c=a,g=d["".concat(s,".").concat(c)]||d[c]||u[c]||l;return o?t.createElement(g,r(r({ref:n},m),{},{components:o})):t.createElement(g,r({ref:n},m))}));function g(e,n){var o=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var l=o.length,r=new Array(l);r[0]=c;var i={};for(var s in n)hasOwnProperty.call(n,s)&&(i[s]=n[s]);i.originalType=e,i[d]="string"==typeof e?e:a,r[1]=i;for(var p=2;p<l;p++)r[p]=o[p];return t.createElement.apply(null,r)}return t.createElement.apply(null,o)}c.displayName="MDXCreateElement"},9826:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>s,contentTitle:()=>r,default:()=>d,frontMatter:()=>l,metadata:()=>i,toc:()=>p});var t=o(7462),a=(o(7294),o(3905));const l={sidebar_position:1},r="7.1 TinyGo",i={unversionedId:"develop-guide/go/hello_world",id:"develop-guide/go/hello_world",title:"7.1 TinyGo",description:"The best way to run Go programs in WasmEdge is to compile Go source code to WebAssembly using TinyGo. In this article, we will show you how.",source:"@site/docs/develop-guide/go/hello_world.md",sourceDirName:"develop-guide/go",slug:"/develop-guide/go/hello_world",permalink:"/book/zh-Hans/develop-guide/go/hello_world",draft:!1,editUrl:"https://github.com/alabulei1/book/docs/develop-guide/go/hello_world.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"developSidebar",previous:{title:"Develop Wasm Apps in Go",permalink:"/book/zh-Hans/category/develop-wasm-apps-in-go"},next:{title:"Deploy WasmEdge apps in Kubernetes",permalink:"/book/zh-Hans/category/deploy-wasmedge-apps-in-kubernetes"}},s={},p=[{value:"Install TinyGo",id:"install-tinygo",level:2},{value:"Hello world",id:"hello-world",level:2},{value:"Hello world: Compile and build",id:"hello-world-compile-and-build",level:3},{value:"Hello world: Run",id:"hello-world-run",level:3},{value:"A simple function",id:"a-simple-function",level:2},{value:"A simple function: Compile and build",id:"a-simple-function-compile-and-build",level:3},{value:"A simple function: Run",id:"a-simple-function-run",level:3},{value:"Improve performance",id:"improve-performance",level:2}],m={toc:p};function d(e){let{components:n,...o}=e;return(0,a.kt)("wrapper",(0,t.Z)({},m,o,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"71-tinygo"},"7.1 TinyGo"),(0,a.kt)("p",null,"The best way to run Go programs in WasmEdge is to compile Go source code to WebAssembly using ",(0,a.kt)("a",{parentName:"p",href:"https://tinygo.org/"},"TinyGo"),". In this article, we will show you how."),(0,a.kt)("h2",{id:"install-tinygo"},"Install TinyGo"),(0,a.kt)("p",null,"You must have ",(0,a.kt)("a",{parentName:"p",href:"https://go.dev/doc/install"},"Go already installed")," on your machine before installing TinyGo. Go v1.17 or above is recommended.\nFor Ubuntu or other Debian-based Linux systems on x86 processors, you could use the following command line to install TinyGo. For other platforms, please refer to ",(0,a.kt)("a",{parentName:"p",href:"https://tinygo.org/getting-started/install/"},"TinyGo docs"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"wget https://github.com/tinygo-org/tinygo/releases/download/v0.21.0/tinygo_0.21.0_amd64.deb\nsudo dpkg -i tinygo_0.21.0_amd64.deb`\n")),(0,a.kt)("p",null,"Next, run the following command line to check out if the installation is successful."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ tinygo version\ntinygo version 0.21.0 linux/amd64 (using go version go1.16.7 and LLVM version 11.0.0)\n")),(0,a.kt)("h2",{id:"hello-world"},"Hello world"),(0,a.kt)("p",null,"The simple Go app has a ",(0,a.kt)("inlineCode",{parentName:"p"},"main()")," function to print a message to the console.\nThe source code in ",(0,a.kt)("inlineCode",{parentName:"p"},"main.go")," file is as follows."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-go"},'package main\n\nfunc main() {\n  println("Hello TinyGo from WasmEdge!")\n}\n')),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"Inside the ",(0,a.kt)("inlineCode",{parentName:"p"},"main()")," function, you can use Go standard API to read / write files, and access command line arguments and ",(0,a.kt)("inlineCode",{parentName:"p"},"env")," variables.")),(0,a.kt)("h3",{id:"hello-world-compile-and-build"},"Hello world: Compile and build"),(0,a.kt)("p",null,"Next, compile the ",(0,a.kt)("inlineCode",{parentName:"p"},"main.go")," program to WebAssembly using TinyGo."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"tinygo build -o hello.wasm -target wasi main.go\n")),(0,a.kt)("p",null,"You will see a file named ",(0,a.kt)("inlineCode",{parentName:"p"},"hello.wasm")," in the same directory. This is a WebAssembly bytecode file."),(0,a.kt)("h3",{id:"hello-world-run"},"Hello world: Run"),(0,a.kt)("p",null,"You can run it with the ",(0,a.kt)("a",{parentName:"p",href:"../build-and-run/cli"},"WasmEdge CLI"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ wasmedge hello.wasm\nHello TinyGo from WasmEdge!\n")),(0,a.kt)("h2",{id:"a-simple-function"},"A simple function"),(0,a.kt)("p",null,"The second example is a Go function that takes a call parameter to compute a fibonacci number. However, in order for the Go application to set up proper access to the OS (e.g., to access the command line arguments), you must include an empty ",(0,a.kt)("inlineCode",{parentName:"p"},"main()")," function in the source code."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-go"},"package main\n\nfunc main(){\n}\n\n//export fibArray\nfunc fibArray(n int32) int32{\n  arr := make([]int32, n)\n  for i := int32(0); i < n; i++ {\n    switch {\n    case i < 2:\n      arr[i] = i\n    default:\n      arr[i] = arr[i-1] + arr[i-2]\n    }\n  }\n  return arr[n-1]\n}\n")),(0,a.kt)("h3",{id:"a-simple-function-compile-and-build"},"A simple function: Compile and build"),(0,a.kt)("p",null,"Next, compile the ",(0,a.kt)("inlineCode",{parentName:"p"},"main.go")," program to WebAssembly using TinyGo."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"tinygo build -o fib.wasm -target wasi main.go\n")),(0,a.kt)("p",null,"You will see a file named ",(0,a.kt)("inlineCode",{parentName:"p"},"fib.wasm")," in the same directory. This is a WebAssembly bytecode file."),(0,a.kt)("h3",{id:"a-simple-function-run"},"A simple function: Run"),(0,a.kt)("p",null,"You can run it with the ",(0,a.kt)("a",{parentName:"p",href:"../build-and-run/cli"},"WasmEdge CLI")," in its ",(0,a.kt)("inlineCode",{parentName:"p"},"--reactor")," mode.\nThe command line arguments that follow the ",(0,a.kt)("inlineCode",{parentName:"p"},"wasm")," file are the function name and its call parameters."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ wasmedge --reactor fib.wasm fibArray 10\n34\n")),(0,a.kt)("h2",{id:"improve-performance"},"Improve performance"),(0,a.kt)("p",null,"To achieve native Go performance for those applications, you could use the ",(0,a.kt)("inlineCode",{parentName:"p"},"wasmedgec")," command to AOT compile the ",(0,a.kt)("inlineCode",{parentName:"p"},"wasm")," program, and then run it with the ",(0,a.kt)("inlineCode",{parentName:"p"},"wasmedge")," command."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ wasmedgec hello.wasm hello.wasm\n\n$ wasmedge hello.wasm\nHello TinyGo from WasmEdge!\n")),(0,a.kt)("p",null,"For the ",(0,a.kt)("inlineCode",{parentName:"p"},"--reactor")," mode,"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ wasmedgec fib.wasm fib.wasm\n\n$ wasmedge --reactor fib.wasm fibArray 10\n34\n")))}d.isMDXComponent=!0}}]);