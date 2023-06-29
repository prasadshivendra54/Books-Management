const express = require('express')
const router = express.Router()

// Controllers - 
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')

// Middleware -
const {authentication, authorization} =  require('../middlewares/auth')



// ______________ API's _______________

// User APIs -
router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)



// Books API -
router.post('/books', authentication, bookController.addBooks)
router.get('/books', authentication, bookController.getBooks)
router.get('/books/:bookId', authentication, bookController.getBooksById)
router.put('/books/:bookId', authentication, authorization, bookController.updateBookById)
router.delete('/books/:bookId', authentication, authorization, bookController.deleteBookById)



// Review APIs - 
router.post('/books/:bookId/review', authentication, reviewController.postReview)
router.put('/books/:bookId/review/:reviewId', authentication, reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId', authentication, reviewController.deleteReview)


module.exports = router
