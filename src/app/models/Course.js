var mongooseDelete = require('mongoose-delete');
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;
const Course = new Schema(
    {
        _id: { type: Number },
        name: { type: String, maxLength: 255, required: true, unique: false },
        description: { type: String, maxLength: 255, required: true, unique: false },
        image: { type: String, maxLength: 255, required: true, unique: false },
        slug: { type: String, maxLength: 255, slug: 'name', unique: true, unique: false },
    },
    {
        _id: false,
        timestamps: true,
    },
);

//add plugin
mongoose.plugin(slug);
Course.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
Course.plugin(AutoIncrement);
// { overrideMethods: 'all' } chi hien thi nhung cai khong co deleted
//deletedAt: true: thêm trường dữ liệu deletedAt -> xóa có lưu thời gian
module.exports = mongoose.model('Course', Course);
