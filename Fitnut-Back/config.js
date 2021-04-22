require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || '8000',
    MONGO_USER: process.env.MONGO_USER || 'defaultuser',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'defaultpass',
    DBNAME: process.env.DBNAME || 'defaultdb',
    GOOGLEAPI: process.env.GOOGLEAPI || 'I AM MISSING!',
    SECRET_KEY :process.env.SECRET_KEY || ''
}