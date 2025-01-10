const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AuthCode = require('../models/AuthCode');
const { generateRandomNumber } = require('../../utils/randomGenerator');
const { generateRandomStringAndHash } = require('../../utils/randomGenerator');
const { decrypt } = require('../../utils/secure');
const jwt = require('jsonwebtoken');
const { sendSMS } = require('../../utils/smsSender');
const { changfirstDigitOfPphone } = require('../../utils/formatPhoneNumber');

class AuthenticationsController {
    //[POST]/authentication/createTemporaryAccount
    async createTemporaryAccount(req, res) {
        const { fullName, password, phoneNumber } = req.body;

        try {
            const availablePhoneNumber = await User.findOne({ phone_number: phoneNumber });
            if (availablePhoneNumber) {
                return res.status(400).json({
                    phoneNumber: 'Phone number have already existed',
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const randNumber = await generateRandomNumber();
            const randString = await generateRandomStringAndHash();

            const newAuthCode = new AuthCode({
                auth_code: randNumber,
                key_Checked: randString.randomString,
            });

            await newAuthCode.save();

            const message = `Your verification code is: ${randNumber}. Please enter it to complete the registration process.`;
            const formattedPhoneNumber = changfirstDigitOfPphone(phoneNumber);
            // await sendSMS(formattedPhoneNumber, message);

            res.status(201).json({
                message: 'Sent SMS successfully',
                user: {
                    fullName: fullName,
                    password: hashedPassword,
                    phoneNumber: phoneNumber,
                    keyChecked: randString.encryptedData,
                },
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to send SMS', error });
        }
    }

    //[POST]/authentication/resendAuthCode
    async resendAuthCode(req, res) {
        const { fullName, keyChecked, password, phoneNumber } = req.body;

        try {
            const secretKey = process.env.SECRET_KEY;
            const descryp_key = decrypt(keyChecked, secretKey);
            const authRecord = await AuthCode.findOne({ key_Checked: descryp_key });

            if (!authRecord) {
                return res.status(404).json({ message: descryp_key });
            }

            const randNumber = await generateRandomNumber();
            const message = `Your verification code is: ${randNumber}. Please enter it to complete the registration process.`;
            const formattedPhoneNumber = changfirstDigitOfPphone(phoneNumber);
            // await sendSMS(formattedPhoneNumber, message);

            const updatedAuthCode = await AuthCode.findOneAndUpdate(
                { auth_code: authRecord.auth_code },
                { key_Checked: descryp_key },
                { new: true },
            );

            if (!updatedAuthCode) {
                return res.status(500).json({ message: 'Failed to update auth code' });
            }

            res.status(201).json({
                message: 'Sent SMS successfully',
                user: {
                    fullName: fullName,
                    password: password,
                    phoneNumber: phoneNumber,
                    keyChecked: keyChecked,
                },
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to resend auth code', error });
        }
    }

    //[POST] authentication/signup
    async signup(req, res) {
        const { fullName, keyChecked, auth_code, password, phoneNumber } = req.body;
        try {
            const secretKey = process.env.SECRET_KEY;
            const descryp_key = decrypt(keyChecked, secretKey);
            const authRecord = await AuthCode.findOne({ auth_code: auth_code, key_Checked: descryp_key });
            if (!authRecord) {
                return res.status(400).json({ message: 'Invalid authentication code or keyChecked' });
            }
            const newUser = new User({
                full_name: fullName,
                phone_number: phoneNumber,
                password: password,
            });
            await newUser.save();
            await AuthCode.deleteOne({ _authCodeId: authRecord._authCodeId });
            res.status(201).json({
                message: 'Account created successfully',
                user: {
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                },
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create account', error });
        }
    }
    //[POST] authentications/deleteAuthCode
    async deleteAuthCode(req, res) {
        const { fullName, phoneNumber, keyChecked, password } = req.body;
        const secretKey = process.env.SECRET_KEY;

        // Decrypt the key
        const descryp_key = decrypt(keyChecked, secretKey);

        try {
            const authRecord = await AuthCode.findOne({ key_Checked: descryp_key });

            if (!authRecord) {
                return res.status(404).json({ message: 'Authentication code not found for the given keyChecked' });
            }

            // Delete the record
            await AuthCode.deleteOne({ key_Checked: descryp_key });

            // Return success response
            res.status(200).json({ message: 'delete auth code succesfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete auth code', error });
        }
    }
    //[POST] authentications/signin
    async signin(req, res) {
        const { phoneNumber, password } = req.body;
        const secretKey = process.env.SECRET_KEY;

        try {
            const user = await User.findOne({ phone_number: phoneNumber });
            if (!user) {
                return res.status(400).json({
                    phoneNumber: 'this phone number have not registered',
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    password: 'incorrect password',
                });
            }
            const accessToken = jwt.sign({ _id: user._id }, secretKey);

            return res.status(200).json({
                message: 'login success',
                accessToken: accessToken,
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to login', error });
        }
    }
    //[GET] authentications/UserAuthenticate
    async UserAuthenticate(req, res, next) {
        const secretKey = process.env.SECRET_KEY;
        try {
            const token = req.header('Authorization')?.split(' ')[1];
            if (!token) {
                return res.status(403).json({
                    message: 'You are not logged in',
                });
            }

            const decode = jwt.verify(token, secretKey);
            const user = await User.findById(decode._id);
            if (!user) {
                return res.status(403).json({
                    message: 'Invalid token',
                });
            }

            return res.status(200).json({
                data: user,
            });
        } catch (error) {
            return res.status(500).json({
                name: error.name,
                message: error.message,
            });
        }
    }
}

module.exports = new AuthenticationsController();
