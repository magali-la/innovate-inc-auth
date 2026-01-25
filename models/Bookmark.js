const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    // add user to each bookmark
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    }
})

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;