// 주제 08의 "해시 테이블 밖의 해시 함수" 데모가 함께 쓰는 해시 구현.
//
// 데모의 숫자가 실제 값이 되도록 알고리즘을 그대로 옮겼다. SHA-256은 FIPS 180-4,
// MurmurHash3는 x86_32판, SipHash는 c-d 라운드를 고를 수 있는 판이다(Python과
// Rust가 쓰는 1-3). 공개키 암호 데모의 modPow·modInv도 함께 둔다. 컴포넌트가 이 파일을
// ?raw로 읽어 is:inline으로 넣는다.
(() => {
  if (globalThis.aasHashAlgos) return;
  const encoder = new TextEncoder();
  const bytesOf = (s) => encoder.encode(s);

  const K = new Uint32Array(64);
  const H0 = new Uint32Array(8);
  {
    /* 처음 소수 64개의 세제곱근·제곱근의 소수부 32비트 */
    const primes = [];
    for (let n = 2; primes.length < 64; n++) if (primes.every((p) => n % p)) primes.push(n);
    const frac = (x) => Math.floor((x - Math.floor(x)) * 2 ** 32);
    primes.forEach((p, i) => {
      K[i] = frac(Math.cbrt(p));
      if (i < 8) H0[i] = frac(Math.sqrt(p));
    });
  }
  const W = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  function sha256(bytes) {
    const len = bytes.length;
    const total = ((len + 9 + 63) >> 6) << 6;
    const m = new Uint8Array(total);
    m.set(bytes);
    m[len] = 0x80;
    const view = new DataView(m.buffer);
    view.setUint32(total - 8, Math.floor((len * 8) / 2 ** 32));
    view.setUint32(total - 4, (len * 8) >>> 0);
    const h = H0.slice();
    for (let o = 0; o < total; o += 64) {
      for (let t = 0; t < 16; t++) W[t] = view.getUint32(o + t * 4);
      for (let t = 16; t < 64; t++) {
        const a = W[t - 15];
        const b = W[t - 2];
        W[t] = (W[t - 16] + (rotr(a, 7) ^ rotr(a, 18) ^ (a >>> 3)) + W[t - 7] + (rotr(b, 17) ^ rotr(b, 19) ^ (b >>> 10))) | 0;
      }
      let [a, b, c, d, e, f, g, i] = h;
      for (let t = 0; t < 64; t++) {
        const t1 = (i + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + W[t]) | 0;
        const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        i = g;
        g = f;
        f = e;
        e = (d + t1) | 0;
        d = c;
        c = b;
        b = a;
        a = (t1 + t2) | 0;
      }
      h[0] += a;
      h[1] += b;
      h[2] += c;
      h[3] += d;
      h[4] += e;
      h[5] += f;
      h[6] += g;
      h[7] += i;
    }
    const out = new Uint8Array(32);
    const ov = new DataView(out.buffer);
    h.forEach((x, n) => ov.setUint32(n * 4, x));
    return out;
  }

  function murmur3(bytes, seed = 0) {
    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;
    let h = seed | 0;
    const n = bytes.length;
    const blocks = n >> 2;
    const mixK = (k) => {
      k = Math.imul(k, c1);
      k = (k << 15) | (k >>> 17);
      return Math.imul(k, c2);
    };
    for (let i = 0; i < blocks; i++) {
      const o = i * 4;
      h ^= mixK(bytes[o] | (bytes[o + 1] << 8) | (bytes[o + 2] << 16) | (bytes[o + 3] << 24));
      h = (h << 13) | (h >>> 19);
      h = (Math.imul(h, 5) + 0xe6546b64) | 0;
    }
    let k = 0;
    const tail = blocks * 4;
    if (n & 3) {
      if ((n & 3) >= 3) k ^= bytes[tail + 2] << 16;
      if ((n & 3) >= 2) k ^= bytes[tail + 1] << 8;
      k ^= bytes[tail];
      h ^= mixK(k);
    }
    h ^= n;
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h >>> 0;
  }

  const MASK = (1n << 64n) - 1n;
  const rotl64 = (x, n) => ((x << n) | (x >> (64n - n))) & MASK;
  /* k0, k1은 64비트 BigInt. 결과도 64비트 BigInt다. */
  function siphash(bytes, k0, k1, c = 1, d = 3) {
    let v0 = k0 ^ 0x736f6d6570736575n;
    let v1 = k1 ^ 0x646f72616e646f6dn;
    let v2 = k0 ^ 0x6c7967656e657261n;
    let v3 = k1 ^ 0x7465646279746573n;
    const round = () => {
      v0 = (v0 + v1) & MASK;
      v1 = rotl64(v1, 13n) ^ v0;
      v0 = rotl64(v0, 32n);
      v2 = (v2 + v3) & MASK;
      v3 = rotl64(v3, 16n) ^ v2;
      v0 = (v0 + v3) & MASK;
      v3 = rotl64(v3, 21n) ^ v0;
      v2 = (v2 + v1) & MASK;
      v1 = rotl64(v1, 17n) ^ v2;
      v2 = rotl64(v2, 32n);
    };
    const n = bytes.length;
    const absorb = (m) => {
      v3 ^= m;
      for (let i = 0; i < c; i++) round();
      v0 ^= m;
    };
    let o = 0;
    for (; o + 8 <= n; o += 8) {
      let m = 0n;
      for (let i = 7; i >= 0; i--) m = (m << 8n) | BigInt(bytes[o + i]);
      absorb(m);
    }
    let last = BigInt(n & 0xff) << 56n;
    for (let i = n - 1; i >= o; i--) last |= BigInt(bytes[i]) << BigInt((i - o) * 8);
    absorb(last);
    v2 ^= 0xffn;
    for (let i = 0; i < d; i++) round();
    return v0 ^ v1 ^ v2 ^ v3;
  }

  /* 슬라이드의 두 문자열 해시와 같다. 글자 코드는 코드 포인트다. */
  const sumCodes = (s, m) => {
    let t = 0;
    for (const ch of s) t += ch.codePointAt(0);
    return t % m;
  };
  const horner = (s, m, r = 31) => {
    let h = 0;
    for (const ch of s) h = (r * h + ch.codePointAt(0)) % m;
    return h;
  };
  const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

  /* 공개키 암호 데모의 계산. 모두 BigInt다. */
  const modPow = (base, exp, mod) => {
    let r = 1n;
    let b = base % mod;
    for (let e = exp; e > 0n; e >>= 1n) {
      if (e & 1n) r = (r * b) % mod;
      b = (b * b) % mod;
    }
    return r;
  };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  /* 확장 유클리드 호제법으로 a의 mod m 역원을 구한다. */
  const modInv = (a, m) => {
    let [r0, r1, s0, s1] = [a % m, m, 1n, 0n];
    while (r1) {
      const q = r0 / r1;
      [r0, r1] = [r1, r0 - q * r1];
      [s0, s1] = [s1, s0 - q * s1];
    }
    return ((s0 % m) + m) % m;
  };

  globalThis.aasHashAlgos = { bytesOf, sha256, murmur3, siphash, sumCodes, horner, hex, modPow, gcd, modInv };
})();
