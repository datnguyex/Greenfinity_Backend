var mongooseDelete = require('mongoose-delete');
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const AuthCode = new Schema(
    {
        _authCodeId: { type: Number },
        key_Checked: { type: String, required: true, unique: true },
        auth_code: { type: Number, maxLength: 6, required: true, unique: true },
        slug: { type: String, maxLength: 255, slug: '_authCodeId', unique: true },
    },
    {
        _authCodeId: false, // Không lưu trường _authCodeId trong bản ghi
        timestamps: true, // Tự động thêm createdAt và updatedAt
    },
);

// Thêm plugin
mongoose.plugin(slug); // Cấu hình plugin slug
AuthCode.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
AuthCode.plugin(AutoIncrement, { inc_field: 'authCodeId' }); // Áp dụng AutoIncrement cho _authCodeId

module.exports = mongoose.model('AuthCode', AuthCode);
