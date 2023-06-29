const mongoose = require('mongoose')

const bookReviewSchema = new mongoose.Schema({
    bookId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Book",
        required : true
    },
    reviewedBy: { 
        type : String,
        required : true,
        default : 'Guest',
        value : {
            type : String
        }
    },
    reviewedAt: {
        type : Date,
        required : true,
        default : new Date
    },
    rating: {
        type : Number,
        required : true,
        min : 1,
        max : 5
    },
    review: {
        type : String
    },
    isDeleted: {
        type : Boolean,
        default : false
    }
}, {timestamps : true})

module.exports = mongoose.model('BooksReview', bookReviewSchema)