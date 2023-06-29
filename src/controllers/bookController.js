const mongoose = require('mongoose')
const BooksModel = require('../models/BooksModel')
const UserModel = require('../models/UserModel')
const BookReviewModel = require('../models/BookReviewModel')
const validId = require('../middlewares/auth')


// To add book - 
const addBooks = async (req, res) =>{
    try {
        let bookData = req.body
        if(!bookData.title) return res.status(400).json({status : false, message : "Please Give Title Of Book (REQUIRED)"})
        let title = await BooksModel.find({title : bookData.title})
        if(title.length > 0) return res.status(400).json({status : false, message : "Title Already Exist.."})


        if(!bookData.excerpt) return res.status(400).json({status : false, message : "Please Give Excerpt Of Book (REQUIRED)"})


        if(!bookData.userId) return res.status(400).json({status : false, message : "Please Give UserId (REQUIRED)"})
        if(!validId.isValidObjectId(bookData.userId)) return res.status(400).json({status : false, message : "Please Enter Valid UserId..."})
        let findUserId = await UserModel.findById({_id : bookData.userId})
        if(!findUserId) return res.status(400).json({status : false, message : "UserId Not Exist..."})


        if(!bookData.ISBN) return res.status(400).json({status : false, message : "Please Give ISBN Of Book (REQUIRED)"})
        let ISBN = await BooksModel.find({ISBN : bookData.ISBN})
        if(ISBN.length > 0) return res.status(400).json({status : false, message : "ISBN Already Exist.."})


        if(!bookData.category) return res.status(400).json({status : false, message : "Please Give Category Of Book (REQUIRED)"})


        if(!bookData.subcategory) return res.status(400).json({status : false, message : "Please Give Subcategory Of Book (REQUIRED)"})


        if(!bookData.releasedAt) return res.status(400).json({status : false, message : "Please Enter Released Date Of Book (REQUIRED)"})

        // bookData.userId = req.decode.userId
        if(bookData.userId != req.userId) return res.status(401).send({status : false, message : "You Are Not Authenticated"})
        
        let data = await BooksModel.create(bookData)
        return res.status(201).json({status : true, data : data})
    } catch (error) {
        return res.status(500).json({status : false, message : error.message})
    }
}


// To Get All Books - 
const getBooks = async (req, res) =>{
    try {
        let {userId, category, subcategory} = req.query
        let querys = ({isDeleted : false})
        if (userId) {
            querys.userId = userId; 
        }
        if (category) {
            querys.category = category;
        }
        if (subcategory) {
            querys.subcategory = subcategory;
        }

        let data = await BooksModel.find(querys).select({_id : 1, title : 1, excerpt : 1, userId : 1, category : 1, reviews : 1, releasedAt : 1})


        if(data.length > 0){
            return res.status(200).json({status : true, message : "Books list", data})
        }else{
            return res.status(404).json({status : false, message : "Book Not found"})
        }
    } catch (error) {
        return res.status(500).json({status : false, message : error.message})
    }
}


// Get Book By ID
const getBooksById = async (req, res) =>{
    try {
        let bookId = req.params.bookId
        if(!validId.isValidObjectId(bookId)) return res.status(400).json({status : false, message : "Please give valid bookId"})
        let data = await BooksModel.findOne({_id : bookId, isDeleted : false}).lean()
        if(!data) return res.status(404).json({status : false, message : "Book not found.."})

        const reviews = await BookReviewModel.find({bookId : bookId, isDeleted : false}).select({_id : 1, bookId : 1, reviewedBy : 1, reviewedAt : 1, rating : 1, review : 1})
        data.reviewData = reviews

        return res.status(200).json({status : true, message: 'Books list', data})
    } catch (error) {
        return res.status(500).json({status : false, message : error.message})   
    }
}


// Update Book
const updateBookById = async (req, res) =>{
    try {
        let bookId = req.params.bookId
        if(!validId.isValidObjectId(bookId)) return res.status(400).json({status : false, message : "Please give valid bookId"})
        let bookData = req.body
        let findBookId = await BooksModel.findById(bookId)
        if(findBookId.isDeleted == true) return res.status(404).json({status : false, message : "Book Not Found"})
        if(!findBookId) return res.status(404).json({status : false, message : "Book not found.."})
        let data = await BooksModel.findByIdAndUpdate(
            {_id : bookId},
            {title : bookData.title,
            excerpt : bookData.excerpt,
            ISBN : bookData.ISBN,
            releasedAt : new Date()
            },
            {new : true})
        
        return res.status(200).json({status : true, data : data})
    } catch (error) {
        return res.status(403).json({status : false, message : error.message})
    }
}


// Delete Book
const deleteBookById = async (req, res) =>{
    try {
        let bookId = req.params.bookId
        if(!validId.isValidObjectId(bookId)) return res.status(400).json({status : false, message : "Please give valid bookId"})
        let findBookId = await BooksModel.findById(bookId)
        if(!findBookId) return res.status(404).json({status : false, message : "Book not found.."})
        if(findBookId.isDeleted == true) return res.status(400).json({status : false, message : "Book not found.."})
        let data = await BooksModel.findOneAndUpdate(
            {_id : bookId},
            {isDeleted : true},
            {new : true})
        return res.status(200).json({status : true, message : "Deleted successfully"})
    } catch (error) {
        return res.status(500).json({status : false, message : error.message})
    }
}


// Export Modules
module.exports = {
    addBooks,
    getBooks,
    getBooksById,
    updateBookById,
    deleteBookById
}