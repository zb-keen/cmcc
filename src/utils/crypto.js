//crypto.js文件内容
import CryptoJS from "crypto-js";

/**
 * 加密
 * @param {*} message 需要加密的数据
 * @returns
 */
const encryptByAES = (message) => {
  try {
    let key = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_REQUEST_KEY);
    let iv = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_REQUEST_IV);
    let messageTwo = CryptoJS.enc.Utf8.parse(message);
    let encrypted = CryptoJS.AES.encrypt(messageTwo, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  } catch (error) {
    console.log("请核对加密选项或密文！");
    return "";
  }
};

/**
 * 解密
 * @param {*} message 需要解密的数据
 * @returns
 */
const decryptByAES = (message) => {
  try {
    let key = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_RESPONSE_KEY);
    let iv = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_RESPONSE_IV);
    let decrypted = CryptoJS.AES.decrypt(message, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.log("请核对解密选项或密文！", error);
    return "";
  }
};

const removeTrailingZeros = (str) => {
  return str.replace(/\0+$/, '');
}

export { encryptByAES, decryptByAES };
