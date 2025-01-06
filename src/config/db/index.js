const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/f8_education_dev');
        console.log('connect succesfully!!!!!');
    } catch {
        console.log('Failed!!!!!');
    }
}

module.exports = { connect };
