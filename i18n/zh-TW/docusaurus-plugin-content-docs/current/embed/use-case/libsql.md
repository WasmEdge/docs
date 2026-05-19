---
sidebar_position: 1
---

# libSQL 資料庫中的 UDF

[libSQL](https://github.com/libsql/libsql) 是熱門 [SQLite](https://www.sqlite.org/) 資料庫的分支版本。libSQL 帶來的一項關鍵增強功能是支援 UDF（使用者自訂函式）。透過以 Wasm 為基礎的 UDF，使用者可以為資料庫加入自己的處理邏輯，並即時處理進出資料庫的資料。libSQL 使用 WasmEdge 來執行這些 UDF。在本文中，我會示範如何進行。

## 前置條件

首先，您需要 [安裝 WasmEdge 執行環境](../../start/install.md#install)。

接著，安裝最新版本的 libSQL，或從原始碼建置它。

```bash
git clone https://github.com/libsql/libsql
cd libsql
./configure --enable-wasm-runtime-wasmedge
make
```

## 加密與解密範例

將加密與解密範例建置為 wasm。由於 WasmEdge 在這裡支援 WASI 函式，我們將使用 `wasm32-wasip1` 目標。

```bash
git clone https://github.com/libsql/libsql_bindgen
cd libsql_bindgen/examples/encrypt_decrypt
cargo build --target wasm32-wasip1 --release
```

接著，我們可以建置一個 SQL 檔案，用來在 libSQL 資料庫中建立 `encrypt` 函式。

```bash
export FUNC_NAME='encrypt'
echo "DROP FUNCTION IF EXISTS ${FUNC_NAME};" >> create_${FUNC_NAME}_udf.sql
echo -n "CREATE FUNCTION ${FUNC_NAME} LANGUAGE wasm AS X'" >> create_${FUNC_NAME}_udf.sql
xxd -p  ../../target/wasm32-wasip1/release/libsql_encrypt_decrypt.wasm | tr -d "\n" >> create_${FUNC_NAME}_udf.sql
echo "';" >> create_${FUNC_NAME}_udf.sql
```

為 `decrypt` 函式建立另一個 SQL 檔案。

```bash
export FUNC_NAME='decrypt'
echo "DROP FUNCTION IF EXISTS ${FUNC_NAME};" >> create_${FUNC_NAME}_udf.sql
echo -n "CREATE FUNCTION ${FUNC_NAME} LANGUAGE wasm AS X'" >> create_${FUNC_NAME}_udf.sql
xxd -p  ../../target/wasm32-wasip1/release/libsql_encrypt_decrypt.wasm | tr -d "\n" >> create_${FUNC_NAME}_udf.sql
echo "';" >> create_${FUNC_NAME}_udf.sql
```

現在，您可以將這些 UDF 加入到 libSQL 實例中。

```bash
./libsql
libsql> .init_wasm_func_table
libsql> .read create_encrypt_udf.sql
libsql> .read create_decrypt_udf.sql
```

最後，您可以建立一個資料表並進行測試。

```bash
libsql>

CREATE TABLE secrets(secret);
INSERT INTO secrets (secret) VALUES (encrypt('my secret value: 1', 's3cretp4ss'));
INSERT INTO secrets (secret) VALUES (encrypt('my even more secret value: 2', 's3cretp4ss'));
INSERT INTO secrets (secret) VALUES (encrypt('classified value: 3', 's3cretp4ss'));

SELECT secret, decrypt(secret, 'wrong-pass') from secrets;
secret                                        decrypt(secret, 'wrong-pass')
--------------------------------------------  -----------------------------
IyTvoTEnh9a/f6+pac3rLPToP9DkWqS7CEW8tan3mbQ=  [ACCESS DENIED]
bUQ4fEe6hPnsMx8ABOZO97CMr/wouGTByfUCEmFVZTs=  [ACCESS DENIED]
o+m1w7UdoxBZxLumNW0VoMKSMFaC4o8N5uknAQZ/yFY=  [ACCESS DENIED]

SELECT secret, decrypt(secret, 's3cretp4ss') from secrets;
secret                                        decrypt(secret, 's3cretp4ss')
--------------------------------------------  -----------------------------
IyTvoTEnh9a/f6+pac3rLPToP9DkWqS7CEW8tan3mbQ=  my secret value: 1
bUQ4fEe6hPnsMx8ABOZO97CMr/wouGTByfUCEmFVZTs=  my even more secret value: 2
o+m1w7UdoxBZxLumNW0VoMKSMFaC4o8N5uknAQZ/yFY=  classified value: 3
```
