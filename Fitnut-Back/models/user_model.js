const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const user_schema = new mongoose.Schema({
    username: String,
    password: String,
});

module.exports = mongoose.model('UserModel', user_schema, 'Users');
