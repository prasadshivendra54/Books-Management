const mongoose = require('mongoose')
const BooksModel = require('../models/BooksModel')
const UserModel = require('../models/UserModel')
const BookReviewModel = require('../models/BookReviewModel')
const validId = require('../middlewares/auth')

const postReview = async (req, res) =>{
    try {
        let bookId = req.params.bookId
        if(!validId.isValidObjectId(bookId)) return res.status(400).json({status : false, message : "Please Enter Valid bookId..."})
        let reviewData = req.body
        if(!validId.isValidObjectId(reviewData.bookId)) return res.status(400).json({status : false, message : "Please Enter Valid bookId..."})
        if(!reviewData.bookId) return res.status(400).json({status : false, message : "Please Enter BookId.."})
        if(!reviewData.reviewedBy) return res.status(400).json({status : false, message : "Please Enter Your Name.."})

        if(!reviewData.reviewedAt) return res.status(400).json({status : false, message : "Please Enter Date.."})

        if(!reviewData.rating) return res.status(400).json({status : false, message : "Please Give Book Rating.."})
        
        let findBook = await BooksModel.findOneAndUpdate({_id : bookId, isDeleted : false}, {$inc : {reviews : 1}}, { new: true}).lean()
        if(!findBook) return res.status(400).json({status : false, message : "Book Not Found"})
        const data = await BookReviewModel.create(reviewData)
        findBook["reviewsData"] = data
        return res.status(201).json({status : true, message : "Review added successfully", data : findBook})
    } catch (error) {
        return res.status(500).json({status : false, message : error.message})
    }
}


const updateReview = async (req, res) =>{
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        let reviewData = req.body
        if(!validId.isValidObjectId(bookId)) return res.status(400).json({status : false, message : "Please Enter Valid bookId..."})

        if(!validId.isValidObjectId(reviewId)) return res.status(400).json({status : false, message : "Please Enter Valid reviewId..."})

        let findBook = await BooksModel.findOne({_id : bookId, isDeleted : false}).lean()
        if(!findBook) return res.status(404).json({status : false, message : "Book Not Found"})

        let data = await BookReviewModel.findOneAndUpdate(
            {_id : reviewId, isDeleted : false},
            {review : reviewData.review,
            rating : reviewData.rating,
            reviewedBy : reviewData.reviewedBy},
            {new : true}
        )
        findBook["reviewsData"] = data
        if(!data) return res.status(404).json({status : false, message : "Review Not Found"})
        return res.status(201).json({status : true, message : "Updated Sucessfully", data : data})    
    } catch (error) {
        return res.status(500).json({status : false, message : error.message})
    }
}


const deleteReview = async (req, res) =>{
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        if(!validId.isValidObjectId(bookId)) return res.status(400).json({status : false, message : "Please Enter Valid reviewId..."})

        if(!validId.isValidObjectId(reviewId)) return res.status(400).json({status : false, message : "Please Enter Valid bookId..."})

        let findBook = await BooksModel.findById(bookId)
        if(!findBook) return res.status(404).json({status : false, message : "Book Not Found"})

        let findReview = await BookReviewModel.findOneAndUpdate(
            {_id : reviewId, isDeleted : false},
            {$set : {isDeleted : true}},
            {new : true}
        )
        if(!findReview) return res.status(404).json({status : false, message : "Review Not Found"})

        let updatedReview = await BooksModel.findOneAndUpdate(
            {_id : bookId, isDeleted : false},
            {$inc : {reviews : -1}},
            {new : true}
        ).lean()

        return res.status(200).json({status : true, message : "Deleted successfully"})   
    } catch (error) {
        return res.status(500).json({status : false, message : error.message})
    }
}


module.exports = {
    postReview,
    updateReview,
    deleteReview
}