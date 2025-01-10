const random = require('random');
const crypto = require('crypto');
const AuthCode = require('../app/models/AuthCode');
const { encrypt } = require('./secure');

//create random number from 100000 to 999999
async function generateRandomNumber(min = 100000, max = 999999) {
    let isUnique = false;
    let randomNumber = 0;

    while (!isUnique) {
        randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        const existingAuthCode = await AuthCode.findOne({ auth_code: randomNumber });

        if (!existingAuthCode) {
            isUnique = true;
        }
    }

    return randomNumber;
}
//create random enscryped string
async function generateRandomStringAndHash(length = 16) {
    const secretKey = process.env.SECRET_KEY;
    let isUnique = false;
    let randomString = '';

    while (!isUnique) {
        randomString = crypto.randomBytes(length).toString('hex');
        const existingAuthCode = await AuthCode.findOne({ keyChecked: randomString });

        if (!existingAuthCode) {
            isUnique = true;
        }
    }

    const { iv, encryptedData } = encrypt(randomString, secretKey);

    return {
        encryptedData,
        iv,
        randomString,
    };
}
module.exports = {
    generateRandomNumber,
    generateRandomStringAndHash,
};
