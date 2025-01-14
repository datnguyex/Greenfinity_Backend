// Authentication middleware (authentication.js)
const jwt = require('jsonwebtoken');
const User = require('../app/models/User');

const Authentication = async (req, res, next) => {
    const secretKey = process.env.SECRET_KEY;
    try {
        const token = req.header('Authorization')?.split(' ')[1]; // Lấy token từ header
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

        req.user = user; // Thêm thông tin người dùng vào request nếu cần thiết
        next();
    } catch (error) {
        return res.status(500).json({
            name: error.name,
            message: error.message,
        });
    }
};

// Xuất middleware mà không cần tạo instance
module.exports = Authentication;
