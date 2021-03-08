let mongoose = require('mongoose');

let bookModel = mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    authorName: {
        type: String
    },
    uploadedBy: {
        type: String,
        required: true
    },
    uploadedDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    bookContent: {
        type: Buffer,
        required: true
    }
});

module.exports = mongoose.model('bookSchema', bookModel);