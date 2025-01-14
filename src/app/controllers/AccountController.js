const User = require('../models/User');
const bcrypt = require('bcryptjs');
//[POST] account/UserAuthenticate
class AcountController {
    async DeleteAccount(req, res, next) {
        try {
            const user = req.user;

            await User.findByIdAndDelete(user._id);

            return res.status(200).json({
                message: 'Account deleted successfully',
            });
        } catch (error) {
            return res.status(500).json({
                message: 'An error occurred while deleting account',
                error: error.message,
            });
        }
    }
    //[POST] account/checkPassword
    async checkPassword(req, res, next) {
        try {
            const user = req.user;
            const { currentPassword } = req.body;

            // Ensure the currentPassword is provided
            if (!currentPassword) {
                return res.status(400).json({
                    message: 'Current password is required',
                });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: 'Password is incorrect',
                });
            }

            return res.status(200).json({
                message: 'Password is correct',
            });
        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({
                message: 'An error occurred while handling the request',
            });
        }
    }
}
module.exports = new AcountController();
