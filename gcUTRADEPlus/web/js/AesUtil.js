var AesUtil = function (keySize, iterationCount) {
  this.keySize = keySize / 32;
  this.iterationCount = iterationCount;
};

AesUtil.prototype.generateKey = function (salt, passPhrase) {
  var key = CryptoJS.PBKDF2(
    passPhrase,
    CryptoJS.enc.Hex.parse(salt),
    // { keySize: this.keySize, iterations: this.iterationCount });

      { keySize: this.keySize, iterations: this.iterationCount, hasher: CryptoJS.algo.SHA1 });
  return key;
}

AesUtil.prototype.encrypt = function (salt, iv, passPhrase, plainText) {
  var key = this.generateKey(salt, passPhrase);
  var encrypted = CryptoJS.AES.encrypt(
    plainText,
    key,
    { iv: CryptoJS.enc.Hex.parse(iv) });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

AesUtil.prototype.decrypt = function (salt, iv, passPhrase, cipherText) {
  var key = this.generateKey(salt, passPhrase);
  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText)
  });
  var decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    key,
    { iv: CryptoJS.enc.Hex.parse(iv) });
  try {
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption failed:", e);
    return "";
  }
}

  function JSChecksum(s) {
    var i;
    var chk = 0x12345678;

    for (i = 0; i < s.length; i++) {
      chk += (s.charCodeAt(i) * i);
    }
    return chk;
  }
