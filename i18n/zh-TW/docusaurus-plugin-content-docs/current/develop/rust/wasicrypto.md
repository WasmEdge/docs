---
sidebar_position: 9
---

# WASI 的密碼學

雖然最佳化編譯器能讓密碼學特性在 WebAssembly 中有效率地實作，但在某些情境下仍以主機端實作為佳。[WASI-crypto](https://github.com/WebAssembly/wasi-crypto/blob/main/docs/HighLevelGoals.md) 透過定義一套標準介面 API 來填補這些空缺。目前尚未支援 Android。

請確認[您已安裝 Rust 與 WasmEdge](setup.md)，並已[安裝 WASI-crypto 外掛](../../start/install.md#wasi-crypto-plug-in)。

## 使用 WASI-Crypto 撰寫 WebAssembly

### _（選用）_ Rust 安裝

若要在 Rust 中匯入 WASI-Crypto，您需要在 cargo.toml 中使用 [wasi-crypto 繫結](https://github.com/WebAssembly/wasi-crypto/tree/main/implementations/bindings/rust)。

```toml
[dependencies]
wasi-crypto = "0.1.5"
```

### 高階操作

#### 雜湊函式

| 識別字        | 演算法                                       |
| ------------- | -------------------------------------------- |
| `SHA-256`     | SHA-256 雜湊函式                             |
| `SHA-512`     | SHA-512 雜湊函式                             |
| `SHA-512/256` | 帶有特定 IV 的 SHA-512/256 雜湊函式          |

```rust
// hash "test" by SHA-256
let hash : Vec<u8> = Hash::hash("SHA-256", b"test", 32, None)?;
assert_eq!(hash.len(), 32);
```

#### 訊息驗證函式

| 識別字         | 演算法                                       |
| -------------- | -------------------------------------------- |
| `HMAC/SHA-256` | RFC2104 MAC，使用 SHA-256 雜湊函式           |
| `HMAC/SHA-512` | RFC2104 MAC，使用 SHA-512 雜湊函式           |

```rust
// generate key
let key = AuthKey::generate("HMAC/SHA-512")?;
// generate tag
let tag = Auth::auth("test", &key)?;
// verify
Auth::auth_verify("test", &key, tag)?;
```

#### 金鑰衍生函式

| 識別字 | 演算法 |
| --- | --- |
| `HKDF-EXTRACT/SHA-256` | RFC5869 `EXTRACT` 函式，使用 SHA-256 雜湊函式 |
| `HKDF-EXTRACT/SHA-512` | RFC5869 `EXTRACT` 函式，使用 SHA-512 雜湊函式 |
| `HKDF-EXPAND/SHA-256` | RFC5869 `EXPAND` 函式，使用 SHA-256 雜湊函式 |
| `HKDF-EXPAND/SHA-512` | RFC5869 `EXPAND` 函式，使用 SHA-512 雜湊函式 |

範例：

```rust
let key = HkdfKey::generate("HKDF-EXTRACT/SHA-512")?;
let prk = Hkdf::new("HKDF-EXPAND/SHA-512", &key, Some(b"salt"))?;
let derived_key = prk.expand("info", 100)?;
assert_eq!(derived_key.len(), 100);
```

#### 簽章操作

| 識別字 | 演算法 |
| --- | --- |
| `ECDSA_P256_SHA256` | ECDSA over the NIST p256 curve with the SHA-256 hash function |
| `ECDSA_K256_SHA256` | ECDSA over the secp256k1 curve with the SHA-256 hash function |
| `Ed25519` | Edwards Curve signatures over Edwards25519 (pure EdDSA) as specified in RFC8032 |
| `RSA_PKCS1_2048_SHA256` | RSA signatures with a 2048 bit modulus, PKCS1 padding and the SHA-256 hash function |
| `RSA_PKCS1_2048_SHA384` | RSA signatures with a 2048 bit modulus, PKCS1 padding and the SHA-384 hash function |
| `RSA_PKCS1_2048_SHA512` | RSA signatures with a 2048 bit modulus, PKCS1 padding and the SHA-512 hash function |
| `RSA_PKCS1_3072_SHA384` | RSA signatures with a 3072 bit modulus, PKCS1 padding and the SHA-384 hash function |
| `RSA_PKCS1_3072_SHA512` | RSA signatures with a 3072 bit modulus, PKCS1 padding and the SHA-512 hash function |
| `RSA_PKCS1_4096_SHA512` | RSA signatures with a 4096 bit modulus, PKCS1 padding and the SHA-512 hash function |
| `RSA_PSS_2048_SHA256` | RSA signatures with a 2048 bit modulus, PSS padding and the SHA-256 hash function |
| `RSA_PSS_2048_SHA384` | RSA signatures with a 2048 bit modulus, PSS padding and the SHA-384 hash function |
| `RSA_PSS_2048_SHA512` | RSA signatures with a 2048 bit modulus, PSS padding and the SHA-512 hash function |
| `RSA_PSS_3072_SHA384` | RSA signatures with a 2048 bit modulus, PSS padding and the SHA-384 hash function |
| `RSA_PSS_3072_SHA512` | RSA signatures with a 3072 bit modulus, PSS padding and the SHA-512 hash function |
| `RSA_PSS_4096_SHA512` | RSA signatures with a 4096 bit modulus, PSS padding and the SHA-512 hash function |

範例：

```rust
let pk = SignaturePublicKey::from_raw("Ed25519", &[0; 32])?;

let kp = SignatureKeyPair::generate("Ed25519")?;
let signature = kp.sign("hello")?;

kp.publickey()?.signature_verify("hello", &signature)?;
```
