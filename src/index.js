var methodOverride = require('method-override');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config/db');

// Kết nối với cơ sở dữ liệu
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Nên chỉ định 'extended: true'
app.use(express.json());

// Sử dụng method-override để hỗ trợ phương thức HTTP bị hạn chế như PUT, DELETE
app.use(methodOverride('_method')); // Sử dụng method-override với _method

// http logger
app.use(morgan('combined'));

// Định tuyến
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
