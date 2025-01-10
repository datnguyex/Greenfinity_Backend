const crypto = require('crypto');

//standarize secret key
function normalizeKeyLength(secretKey) {
    const keyBuffer = Buffer.from(secretKey, 'utf-8');
    if (keyBuffer.length === 32) {
        return keyBuffer;
    }
    if (keyBuffer.length > 32) {
        return keyBuffer.slice(0, 32);
    }
    const paddedKey = Buffer.alloc(32);
    keyBuffer.copy(paddedKey);
    return paddedKey;
}
//Fixed Vector Initialization
const DEFAULT_IV = Buffer.from('1234567890abcdef1234567890abcdef', 'hex');

//enscryption
function encrypt(text, secretKey) {
    const normalizedKey = normalizeKeyLength(secretKey);
    const cipher = crypto.createCipheriv('aes-256-cbc', normalizedKey, DEFAULT_IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        iv: DEFAULT_IV.toString('hex'),
        encryptedData: encrypted,
    };
}

//description
function decrypt(encryptedData, secretKey) {
    const normalizedKey = normalizeKeyLength(secretKey);
    const decipher = crypto.createDecipheriv('aes-256-cbc', normalizedKey, Buffer.from(DEFAULT_IV, 'hex')); // Sử dụng DEFAULT_IV cố định
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt,
};
