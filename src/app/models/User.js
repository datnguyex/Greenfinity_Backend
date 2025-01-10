var mongooseDelete = require('mongoose-delete');
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const User = new Schema(
    {
        _id: { type: Number },
        full_name: { type: String, maxLength: 255, required: true, unique: false },
        description: { type: String, maxLength: 255, required: false, unique: false },
        phone_number: { type: String, maxLength: 255, required: true, unique: true },
        password: { type: String, maxLength: 255, required: true, unique: false },
        image: { type: String, maxLength: 255, required: false, unique: false },
        slug: { type: String, maxLength: 255, slug: 'full_name', unique: true, unique: false },
    },
    {
        _id: false,
        timestamps: true,
    },
);

//add plugin
mongoose.plugin(slug);
User.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
User.plugin(AutoIncrement);
// { overrideMethods: 'all' } chi hien thi nhung cai khong co deleted
//deletedAt: true: thêm trường dữ liệu deletedAt -> xóa có lưu thời gian

module.exports = mongoose.model('User', User);
