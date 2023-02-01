"use strict";(self.webpackChunkbook=self.webpackChunkbook||[]).push([[2551],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>h});var o=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function n(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,o)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?n(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function d(e,t){if(null==e)return{};var a,o,r=function(e,t){if(null==e)return{};var a,o,r={},n=Object.keys(e);for(o=0;o<n.length;o++)a=n[o],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(o=0;o<n.length;o++)a=n[o],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=o.createContext({}),s=function(e){var t=o.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=s(e.components);return o.createElement(l.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},c=o.forwardRef((function(e,t){var a=e.components,r=e.mdxType,n=e.originalType,l=e.parentName,p=d(e,["components","mdxType","originalType","parentName"]),u=s(a),c=r,h=u["".concat(l,".").concat(c)]||u[c]||m[c]||n;return a?o.createElement(h,i(i({ref:t},p),{},{components:a})):o.createElement(h,i({ref:t},p))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var n=a.length,i=new Array(n);i[0]=c;var d={};for(var l in t)hasOwnProperty.call(t,l)&&(d[l]=t[l]);d.originalType=e,d[u]="string"==typeof e?e:r,i[1]=d;for(var s=2;s<n;s++)i[s]=a[s];return o.createElement.apply(null,i)}return o.createElement.apply(null,a)}c.displayName="MDXCreateElement"},7213:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>n,metadata:()=>d,toc:()=>s});var o=a(7462),r=(a(7294),a(3905));const n={sidebar_position:1},i="2.2.4.1 Build WasmEdge for Android",d={unversionedId:"contribute-guide/source/os/android/build",id:"contribute-guide/source/os/android/build",title:"2.2.4.1 Build WasmEdge for Android",description:"The WasmEdge Runtime releases come with pre-built binaries for the Android OS. Why WasmEdge on Android?",source:"@site/docs/contribute-guide/source/os/android/build.md",sourceDirName:"contribute-guide/source/os/android",slug:"/contribute-guide/source/os/android/build",permalink:"/book/contribute-guide/source/os/android/build",draft:!1,editUrl:"https://github.com/alabulei1/book/docs/contribute-guide/source/os/android/build.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"contributeSidebar",previous:{title:"Build and Run WasmEdge on Android",permalink:"/book/category/build-and-run-wasmedge-on-android"},next:{title:"2.2.4.2 CLI Tools",permalink:"/book/contribute-guide/source/os/android/cli"}},l={},s=[{value:"Build from source for Android platforms",id:"build-from-source-for-android-platforms",level:2},{value:"Prepare the Environment",id:"prepare-the-environment",level:2},{value:"Build WasmEdge for Android platforms",id:"build-wasmedge-for-android-platforms",level:2},{value:"Test the WasmEdge CLI on Android platforms",id:"test-the-wasmedge-cli-on-android-platforms",level:2},{value:"Push the WasmEdge CLI and related test data onto Android platforms",id:"push-the-wasmedge-cli-and-related-test-data-onto-android-platforms",level:3},{value:"Run WasmEdge CLI on Android platforms",id:"run-wasmedge-cli-on-android-platforms",level:3},{value:"Notice",id:"notice",level:2}],p={toc:s};function u(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,o.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"2241-build-wasmedge-for-android"},"2.2.4.1 Build WasmEdge for Android"),(0,r.kt)("p",null,"The WasmEdge Runtime releases come with pre-built binaries for the Android OS. Why WasmEdge on Android?"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Native speed & sandbox safety for Android apps"),(0,r.kt)("li",{parentName:"ul"},"Support multiple dev languages \u2014 eg C, ",(0,r.kt)("a",{parentName:"li",href:"/category/develop-wasm-apps-in-rust"},"Rust"),", ",(0,r.kt)("a",{parentName:"li",href:"../../../../category/develop-wasm-apps-in-go"},"Go")," & ",(0,r.kt)("a",{parentName:"li",href:"../../../../category/developing-wasm-apps-in-javascript"},"JS")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/book/embed-guide/overview"},"Embed 3rd party functions")," in your android app"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"../../../../category/deploy-wasmedge-apps-in-kubernetes"},"Kubernetes managed")," android apps")),(0,r.kt)("p",null,"However, the WasmEdge installer does not support Android. The user must download the release files to a computer, and then use the ",(0,r.kt)("inlineCode",{parentName:"p"},"adb")," tool to transfer the files to an Android device or simulator. We will show you how to do that."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/book/contribute-guide/source/os/android/cli"},"WasmEdge CLI tools for Android")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/book/contribute-guide/source/os/android/ndk"},"Call WasmEdge functions from an NDK native app")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/book/contribute-guide/source/os/android/apk"},"Call WasmEdge functions from an Android APK app"))),(0,r.kt)("h2",{id:"build-from-source-for-android-platforms"},"Build from source for Android platforms"),(0,r.kt)("p",null,"Please follow this guide to build and test WasmEdge from source code with Android NDK."),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"In current state, we only support the runtime for the interpreter mode.")),(0,r.kt)("h2",{id:"prepare-the-environment"},"Prepare the Environment"),(0,r.kt)("p",null,"We recommend developers to ",(0,r.kt)("a",{parentName:"p",href:"/book/contribute-guide/source/os/linux##prepare-the-environment"},"use our Docker images")," and follow the steps to prepare the building environment."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Download and extract the ",(0,r.kt)("a",{parentName:"li",href:"https://developer.android.com/ndk/downloads"},"Android NDK 23b"),"."),(0,r.kt)("li",{parentName:"ul"},"Check the cmake for ",(0,r.kt)("a",{parentName:"li",href:"https://cmake.org/download/"},"CMake 3.21")," or greater version."),(0,r.kt)("li",{parentName:"ul"},"Download and install the ",(0,r.kt)("a",{parentName:"li",href:"https://developer.android.com/studio/releases/platform-tools"},"ADB platform tools"),".",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"If you use the debian or ubuntu Linux distributions, you can install the ADB platform tools via ",(0,r.kt)("inlineCode",{parentName:"li"},"apt"),"."))),(0,r.kt)("li",{parentName:"ul"},"An Android device which is ",(0,r.kt)("a",{parentName:"li",href:"https://developer.android.com/studio/debug/dev-options"},"enabled developer options and USB debugging")," and with at least Android 6.0 or higher system version.")),(0,r.kt)("h2",{id:"build-wasmedge-for-android-platforms"},"Build WasmEdge for Android platforms"),(0,r.kt)("p",null,"Get the WasmEdge source code."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/WasmEdge/WasmEdge.git\ncd WasmEdge\n")),(0,r.kt)("p",null,"Add the Android NDK path into the environment variable."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"export ANDROID_NDK_HOME=path/to/you/ndk/dir\n")),(0,r.kt)("p",null,"Run the build script in WasmEdge source code. This script will automatically build the WasmEdge for Android, and the results are in the ",(0,r.kt)("inlineCode",{parentName:"p"},"build")," folder."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"./utils/android/standalone/build_for_android.sh\n")),(0,r.kt)("h2",{id:"test-the-wasmedge-cli-on-android-platforms"},"Test the WasmEdge CLI on Android platforms"),(0,r.kt)("h3",{id:"push-the-wasmedge-cli-and-related-test-data-onto-android-platforms"},"Push the WasmEdge CLI and related test data onto Android platforms"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Connect the device by using a USB cable or Wi-Fi. Then you can check the attached devices via the ",(0,r.kt)("inlineCode",{parentName:"p"},"adb devices")," command."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"$ adb devices\nList of devices attached\n0a388e93      device\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Use the ",(0,r.kt)("inlineCode",{parentName:"p"},"adb push")," command to push the entire ",(0,r.kt)("inlineCode",{parentName:"p"},"build/tools/wasmedge")," folder into the ",(0,r.kt)("inlineCode",{parentName:"p"},"/data/local/tmp")," folder on your Android device."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cp -r examples build/tools/wasmedge/examples\ncd build\nadb push ./tools/wasmedge /data/local/tmp\n")))),(0,r.kt)("h3",{id:"run-wasmedge-cli-on-android-platforms"},"Run WasmEdge CLI on Android platforms"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Please use the ",(0,r.kt)("inlineCode",{parentName:"li"},"adb shell")," command to access into the Android device."),(0,r.kt)("li",{parentName:"ol"},"Follow the steps to test the WasmEdge CLI on the Android device.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"$ cd /data/local/tmp/wasmedge/examples\n$ ../wasmedge hello.wasm 1 2 3\nhello\n1\n2\n3\n\n$ ../wasmedge --reactor add.wasm add 2 2\n4\n\n$ ../wasmedge --reactor fibonacci.wasm fib 8\n34\n\n$ ../wasmedge --reactor factorial.wasm fac 12\n479001600\n\n$ cd js\n$ ./../wasmedge --dir .:. qjs.wasm hello.js 1 2 3\nHello 1 2 3\n")),(0,r.kt)("h2",{id:"notice"},"Notice"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"For the Android 10 or greater versions, SELinux will disallow the untrusted applications' ",(0,r.kt)("inlineCode",{parentName:"li"},"exec()")," system call to execute the binaries in ",(0,r.kt)("inlineCode",{parentName:"li"},"home")," or ",(0,r.kt)("inlineCode",{parentName:"li"},"/data/local/tmp")," folder."),(0,r.kt)("li",{parentName:"ul"},"The Android SELinux policy will disallow the untrusted applications to access the ",(0,r.kt)("inlineCode",{parentName:"li"},"/data/local/tmp")," folder.")))}u.isMDXComponent=!0}}]);