const { default: mongoose } = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true,
        unique : true
    },
    excerpt: {
        type : String,
        required : true,
    },
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    ISBN: {
        type : String,
        required : true,
        unique : true
    },
    category: {
        type : String,
        required : true
    },
    subcategory: {
        type : String,
        required : true
    },
    reviews: {
        // number, default: 0, comment: Holds number of reviews of this book,
        type : Number,
        default : 0,
        // comment: {
        //     String
        // }
    },
    deletedAt: {
        type : Date
    },
    isDeleted: {
        type : Boolean,
        default : false
    },
    releasedAt: {
        // Date, mandatory, format("YYYY-MM-DD"),
        type : Date,
        required : true
    }
}, {timestamps : true})

module.exports = mongoose.model('Book', bookSchema)