const mongoose = require('mongoose');

const video_schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    videoID: String,
    name: String,
    duration: Number,
    category: {
        type: [String]
    },
    diff: Number
});

module.exports = mongoose.model('VideoModel', video_schema, 'Videos');
