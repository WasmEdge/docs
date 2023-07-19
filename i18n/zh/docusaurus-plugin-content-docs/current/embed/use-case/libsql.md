---
sidebar_position: 1
---

# UDF in the libSQL database

[libSQL](https://github.com/libsql/libsql) is a fork of the popular [SQLite](https://www.sqlite.org/) database. One of the key enhancements libSQL brings is UDF (User Defined Functions) support. Through Wasm-based UDFs, users can add their own processing logic to the database, and then process the data in and out of the database on the fly. libSQL uses WasmEdge to run these UDFs. In this article, I will show you how.

## Prerequisites

First, you will need to [install WasmEdge runtime](../../start/install.md#install).

Next, install the latest libSQL or build it from source.

```bash
git clone https://github.com/libsql/libsql
cd libsql
./configure --enable-wasm-runtime-wasmedge
make
```

## The encrypt and decrypt example

Build the encrypt and decrypt example into wasm. Since WasmEdge supports WASI functions here, we will use the `wasm32-wasi` target.

```bash
git clone https://github.com/libsql/libsql_bindgen
cd libsql_bindgen/examples/encrypt_decrypt
cargo build --target wasm32-wasi --release
```

Then, we can build a SQL file for creating the `encrypt` function in a libSQL database.

```bash
export FUNC_NAME='encrypt'
echo "DROP FUNCTION IF EXISTS ${FUNC_NAME};" >> create_${FUNC_NAME}_udf.sql
echo -n "CREATE FUNCTION ${FUNC_NAME} LANGUAGE wasm AS X'" >> create_${FUNC_NAME}_udf.sql
xxd -p  ../../target/wasm32-wasi/release/libsql_encrypt_decrypt.wasm | tr -d "\n" >> create_${FUNC_NAME}_udf.sql
echo "';" >> create_${FUNC_NAME}_udf.sql
```

Create another SQL file for the `decrypt` function.

```bash
export FUNC_NAME='decrypt'
echo "DROP FUNCTION IF EXISTS ${FUNC_NAME};" >> create_${FUNC_NAME}_udf.sql
echo -n "CREATE FUNCTION ${FUNC_NAME} LANGUAGE wasm AS X'" >> create_${FUNC_NAME}_udf.sql
xxd -p  ../../target/wasm32-wasi/release/libsql_encrypt_decrypt.wasm | tr -d "\n" >> create_${FUNC_NAME}_udf.sql
echo "';" >> create_${FUNC_NAME}_udf.sql
```

Now, you can add those UDFs to a libSQL instance.

```bash
./libsql
libsql> .init_wasm_func_table
libsql> .read create_encrypt_udf.sql
libsql> .read create_decrypt_udf.sql
```

Finally, you can create a table and test it.

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
