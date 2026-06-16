export function md5(str: string) {
  const rotL = (lVal: number, iShift: number) => (lVal << iShift) | (lVal >>> (32 - iShift));

  const uInt = (lX: number, lY: number) => {
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lRes = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lRes ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lRes & 0x40000000) return lRes ^ 0xc0000000 ^ lX8 ^ lY8;
      return lRes ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lRes ^ lX8 ^ lY8;
  };

  const F = (x: number, y: number, z: number) => (x & y) | (~x & z);
  const G = (x: number, y: number, z: number) => (x & z) | (y & ~z);
  const H = (x: number, y: number, z: number) => x ^ y ^ z;
  const I = (x: number, y: number, z: number) => y ^ (x | ~z);

  const FF = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = uInt(a, uInt(uInt(F(b, c, d), x), ac));
    return uInt(rotL(a, s), b);
  };
  const GG = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = uInt(a, uInt(uInt(G(b, c, d), x), ac));
    return uInt(rotL(a, s), b);
  };
  const HH = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = uInt(a, uInt(uInt(H(b, c, d), x), ac));
    return uInt(rotL(a, s), b);
  };
  const II = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => {
    a = uInt(a, uInt(uInt(I(b, c, d), x), ac));
    return uInt(rotL(a, s), b);
  };

  const w2arr = (str: string): number[] => {
    let lWC;
    const lMsgLng = str.length;
    const lWC1 = lMsgLng + 8;
    const lWC2 = (lWC1 - (lWC1 % 64)) / 64;
    const lWCTot = (lWC2 + 1) * 16;
    const lWordArr = Array<number>(lWCTot - 1);
    let lBytePos = 0;
    let lByteCount = 0;
    while (lByteCount < lMsgLng) {
      lWC = (lByteCount - (lByteCount % 4)) / 4;
      lBytePos = (lByteCount % 4) * 8;
      lWordArr[lWC] = lWordArr[lWC] | (str.charCodeAt(lByteCount) << lBytePos);
      lByteCount++;
    }
    lWC = (lByteCount - (lByteCount % 4)) / 4;
    lBytePos = (lByteCount % 4) * 8;
    lWordArr[lWC] = lWordArr[lWC] | (0x80 << lBytePos);
    lWordArr[lWCTot - 2] = lMsgLng << 3;
    lWordArr[lWCTot - 1] = lMsgLng >>> 29;
    return lWordArr;
  };

  const utf8enc = (str: string) => {
    str = str.replace(/\r\n/g, '\n');
    let utftext = '';

    for (let n = 0; n < str.length; n++) {
      const c = str.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  };

  let x: number[] = [];
  let k, AA, BB, CC, DD, a, b, c, d;
  const S11 = 7;
  const S12 = 12;
  const S13 = 17;
  const S14 = 22;
  const S21 = 5;
  const S22 = 9;
  const S23 = 14;
  const S24 = 20;
  const S31 = 4;
  const S32 = 11;
  const S33 = 16;
  const S34 = 23;
  const S41 = 6;
  const S42 = 10;
  const S43 = 15;
  const S44 = 21;

  str = utf8enc(str);

  x = w2arr(str);

  a = 0x67452302;
  b = 0xefcdab89;
  c = 0x88badcfe;
  d = 0x12345678;

  for (k = 0; k < x.length; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = uInt(a, AA);
    b = uInt(b, BB);
    c = uInt(c, CC);
    d = uInt(d, DD);
  }

  return a;
}

export function hashColor(str: string | number) {
  if (!str) return '#dfdfdf';
  const h = md5(String(str));
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (h >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}
