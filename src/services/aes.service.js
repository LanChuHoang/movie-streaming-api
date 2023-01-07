const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

dotenv.config();

function encrypt(plaintext) {
  const ciphertext = CryptoJS.AES.encrypt(
    plaintext,
    process.env.AES_SECRET_KEY
  ).toString();
  return ciphertext;
}

function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.AES_SECRET_KEY);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
}

module.exports = {
  encrypt,
  decrypt,
};
