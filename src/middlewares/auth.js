const mongoose = require('mongoose')
const BooksModel = require('../models/BooksModel')
const UserModel = require('../models/UserModel')
const BookReviewModel = require('../models/BookReviewModel')
const jwt = require('jsonwebtoken')
const objectId = require('mongoose').Types.ObjectId


// For Check ID is Valid Or Not - 
const isValidObjectId = (id) =>{
    if(objectId.isValid(id)){
        if((String)(new objectId(id)) == id) return true
        return false
    }
    return false
}




// this is for authentication - 
const authentication = async (req, res, next) =>{
    try {
        let token = req.header('x-api-key')
        
        if(!Object.keys(req.headers).includes('x-api-key')) return res.status(404).json({status : false, message : "Your Header is missing"})

        if(!token){
            return res.status(400).json({status : false, message : "Token is missing"})
        }
        else{
            if(token){
                let decodedToken = jwt.verify(token, "secret-key")
                req.userId = decodedToken.userId
                // console.log(req.userId)
            }else{
                return res.status(401).json({status : false, message : "You Are Not Authenticated"})
            }
        }
        next()
    }
    catch (error) {
        return res.status(500).json({status : false, message : "Token Invalid"})
    }
}




// this is for authorization - 
const authorization = async (req, res, next) =>{
    try {
        let id = req.userId
        let bookId = req.params.bookId
        if(!isValidObjectId(bookId)) return res.status(400).json({status : false, message : "Please give valid bookId"})
        if (bookId) {
            let book = await BooksModel.findById(bookId)
            if (!book) {
                return res.status(404).json({ status: false, message: "book not found" })
            }
            let userId = book.userId
            if (id != userId) {
                return res.status(401).json({ status: false, message: "You are not authorized" })
            }
        }
        next()
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message })
    }
}


// Export Modules - 
module.exports = {
    isValidObjectId,
    authentication,
    authorization
}
