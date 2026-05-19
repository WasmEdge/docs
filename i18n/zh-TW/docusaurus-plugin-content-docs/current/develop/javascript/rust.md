---
sidebar_position: 9
---

# 在 Rust 中實作原生 JS API

對 JavaScript 開發者而言，將 Rust 函式整合到 JavaScript API 中相當實用。這讓開發者能夠以「純 JavaScript」撰寫程式，同時仍可使用高效能的 Rust 函式。透過 [WasmEdge Runtime](https://github.com/WasmEdge/WasmEdge)，您正可以做到這一點。

<!-- prettier-ignore -->
:::note
官方 WasmEdge QuickJS 發行版中的 [internal_module](https://github.com/second-state/wasmedge-quickjs/tree/main/src/internal_module) 資料夾提供了一些內建 JavaScript API 函式的 Rust 實作。這些函式通常需要與 WasmEdge 執行環境中的主機函式互動（例如網路與 TensorFlow），因此無法由 [modules](modules.md) 中的純 JavaScript 實作存取。
:::

## 先決條件

- [安裝 Rust 工具鏈](../rust/setup.md)
- [安裝 WasmEdge QuickJS 並準備就緒](hello_world.md#prerequisites)

## 執行範例

範例位於 `wasmedge-quickjs` 儲存庫的 `examples/embed_js` 資料夾中。您可以依下列方式建置並執行所有範例。

```bash
cd examples/embed_js
cargo build --target wasm32-wasip1 --release
wasmedge --dir .:. target/wasm32-wasip1/release/embed_js.wasm
```

## 程式碼說明：將 JavaScript 嵌入到 Rust 程式中

以下 Rust 片段會對 `code` 變數中的 JavaScript 程式碼進行求值。

```rust
fn js_hello(ctx: &mut Context) {
    println!("\n<----run_simple_js---->");
    let code = r#"print('hello quickjs')"#;
    let r = ctx.eval_global_str(code);
    println!("return value:{:?}", r);
}

... ...

fn main() {
    let mut ctx = Context::new();
    js_hello(&mut ctx);
    ... ...
}
```

## 程式碼說明：建立 JavaScript 函式 API

以下程式碼片段定義一個 Rust 函式，可作為 API 整合到 JavaScript 直譯器中。

```rust
fn run_rust_function(ctx: &mut Context) {

  struct HelloFn;
  impl JsFn for HelloFn {
    fn call(_ctx: &mut Context, _this_val: JsValue, argv: &[JsValue]) -> JsValue {
      println!("hello from rust");
      println!("argv={:?}", argv);
      JsValue::UnDefined
    }
  }

  ...
}
```

以下程式碼片段示範如何將這個 Rust 函式加入 JavaScript 直譯器、命名為 `hi()` 作為其 JavaScript API，並從 JavaScript 程式碼中呼叫它。

```rust
fn run_rust_function(ctx: &mut Context) {
  ...

  let f = ctx.new_function::<HelloFn>("hello");
  ctx.get_global().set("hi", f.into());
  let code = r#"hi(1,2,3)"#;
  let r = ctx.eval_global_str(code);
  println!("return value:{:?}", r);
}

... ...

fn main() {
    let mut ctx = Context::new();
    run_rust_function(&mut ctx);
    ... ...
}
```

執行結果如下。

```bash
hello from rust
argv=[Int(1), Int(2), Int(3)]
return value:UnDefined
```

透過這種方式，您可以建立具有自訂 API 函式的 JavaScript 直譯器。該直譯器在 WasmEdge 內部執行，並能執行從 CLI 或網路呼叫這些 API 函式的 JavaScript 程式碼。

## 程式碼說明：建立 JavaScript 物件 API

在 JavaScript API 設計中，我們有時需要提供一個封裝資料與函式的物件。以下範例為 JavaScript API 定義了一個 Rust 函式。

```rust
fn rust_new_object_and_js_call(ctx: &mut Context) {
  struct ObjectFn;
  impl JsFn for ObjectFn {
    fn call(_ctx: &mut Context, this_val: JsValue, argv: &[JsValue]) -> JsValue {
      println!("hello from rust");
      println!("argv={:?}", argv);
      if let JsValue::Object(obj) = this_val {
        let obj_map = obj.to_map();
        println!("this={:#?}", obj_map);
      }
      JsValue::UnDefined
    }
  }

  ...
}
```

接著我們在 Rust 端建立一個「物件」、設定其資料欄位，然後將 Rust 函式註冊為與該物件關聯的 JavaScript 函式。

```rust
let mut obj = ctx.new_object();
obj.set("a", 1.into());
obj.set("b", ctx.new_string("abc").into());

let f = ctx.new_function::<ObjectFn>("anything");
obj.set("f", f.into());
```

接下來，我們將該 Rust「物件」以 JavaScript 物件 `test_obj` 的形式提供給 JavaScript 直譯器使用。

```rust
ctx.get_global().set("test_obj", obj.into());
```

現在您可以在 JavaScript 程式碼中直接使用 `test_obj` 作為 API 的一部分。

```rust
let code = r#"
  print('test_obj keys=',Object.keys(test_obj))
  print('test_obj.a=',test_obj.a)
  print('test_obj.b=',test_obj.b)
  test_obj.f(1,2,3,"hi")
"#;

ctx.eval_global_str(code);
```

執行結果如下。

```bash
test_obj keys= a,b,f
test_obj.a= 1
test_obj.b= abc
hello from rust
argv=[Int(1), Int(2), Int(3), String(JsString(hi))]
this=Ok(
  {
    "a": Int(
      1,
    ),
    "b": String(
      JsString(
        abc,
      ),
    ),
    "f": Function(
      JsFunction(
        function anything() {
          [native code]
        },
      ),
    ),
  },
)
```

## 完整的 JavaScript 物件 API

在前一個範例中，我們示範了從 Rust 建立 JavaScript API 的簡單範例。在本範例中，我們將建立一個完整的 Rust 模組，並將其作為 JavaScript 物件 API 提供。

### 執行範例

專案位於 [examples/embed_rust_module](https://github.com/second-state/wasmedge-quickjs/tree/main/examples/embed_rust_module) 資料夾中。您可以將它作為標準的 Rust 應用程式在 WasmEdge 中建置並執行。

```bash
cd examples/embed_rust_module
cargo build --target wasm32-wasip1 --release
wasmedge --dir .:. target/wasm32-wasip1/release/embed_rust_module.wasm
```

### 程式碼說明

物件的 Rust 實作是一個如下的模組。它具有資料欄位、建構子、getter 與 setter，以及函式。

```rust
mod point {
  use wasmedge_quickjs::*;

  #[derive(Debug)]
  struct Point(i32, i32);

  struct PointDef;

  impl JsClassDef<Point> for PointDef {
    const CLASS_NAME: &'static str = "Point\0";
    const CONSTRUCTOR_ARGC: u8 = 2;

    fn constructor(_: &mut Context, argv: &[JsValue]) -> Option<Point> {
      println!("rust-> new Point {:?}", argv);
      let x = argv.get(0);
      let y = argv.get(1);
      if let ((Some(JsValue::Int(ref x)), Some(JsValue::Int(ref y)))) = (x, y) {
        Some(Point(*x, *y))
      } else {
        None
      }
    }

    fn proto_init(p: &mut JsClassProto<Point, PointDef>) {
      struct X;
      impl JsClassGetterSetter<Point> for X {
        const NAME: &'static str = "x\0";

        fn getter(_: &mut Context, this_val: &mut Point) -> JsValue {
          println!("rust-> get x");
          this_val.0.into()
        }

        fn setter(_: &mut Context, this_val: &mut Point, val: JsValue) {
          println!("rust-> set x:{:?}", val);
          if let JsValue::Int(x) = val {
            this_val.0 = x
          }
        }
      }

      struct Y;
      impl JsClassGetterSetter<Point> for Y {
        const NAME: &'static str = "y\0";

        fn getter(_: &mut Context, this_val: &mut Point) -> JsValue {
          println!("rust-> get y");
          this_val.1.into()
        }

        fn setter(_: &mut Context, this_val: &mut Point, val: JsValue) {
          println!("rust-> set y:{:?}", val);
          if let JsValue::Int(y) = val {
            this_val.1 = y
          }
        }
      }

      struct FnPrint;
      impl JsMethod<Point> for FnPrint {
        const NAME: &'static str = "pprint\0";
        const LEN: u8 = 0;

        fn call(_: &mut Context, this_val: &mut Point, _argv: &[JsValue]) -> JsValue {
          println!("rust-> pprint: {:?}", this_val);
          JsValue::Int(1)
        }
      }

      p.add_getter_setter(X);
      p.add_getter_setter(Y);
      p.add_function(FnPrint);
    }
  }

  struct PointModule;
  impl ModuleInit for PointModule {
    fn init_module(ctx: &mut Context, m: &mut JsModuleDef) {
      m.add_export("Point\0", PointDef::class_value(ctx));
    }
  }

  pub fn init_point_module(ctx: &mut Context) {
    ctx.register_class(PointDef);
    ctx.register_module("point\0", PointModule, &["Point\0"]);
  }
}
```

在直譯器的實作中，我們先呼叫 `point::init_point_module` 將 Rust 模組註冊到 JavaScript 內容中，接著就可以執行使用 `point` 物件的 JavaScript 程式。

```rust
use wasmedge_quickjs::*;
fn main() {
  let mut ctx = Context::new();
  point::init_point_module(&mut ctx);

  let code = r#"
    import('point').then((point)=>{
    let p0 = new point.Point(1,2)
    print("js->",p0.x,p0.y)
    p0.pprint()
    try{
      let p = new point.Point()
      print("js-> p:",p)
      print("js->",p.x,p.y)
      p.x=2
      p.pprint()
    } catch(e) {
      print("An error has been caught");
      print(e)
    }
    })
  "#;

  ctx.eval_global_str(code);
  ctx.promise_loop_poll();
}
```

上述應用程式的執行結果如下。

```bash
rust-> new Point [Int(1), Int(2)]
rust-> get x
rust-> get y
js-> 1 2
rust-> pprint: Point(1, 2)
rust-> new Point []
js-> p: undefined
An error has been caught
TypeError: cannot read property 'x' of undefined
```

## 程式碼重用

我們可以使用 Rust API 建立繼承（或擴充）既有類別的 JavaScript 類別。這讓開發者能夠透過 Rust 在既有解決方案的基礎上開發複雜的 JavaScript API。您可以參考[這個範例](https://github.com/second-state/wasmedge-quickjs/blob/main/examples/js_extend.rs)。

接下來，您可以查看 [internal_module](https://github.com/second-state/wasmedge-quickjs/tree/main/src/internal_module) 資料夾中的 Rust 程式碼，以獲得更多實作常用 JavaScript 內建函式（包括 [Node.js](nodejs.md) API）的範例。
