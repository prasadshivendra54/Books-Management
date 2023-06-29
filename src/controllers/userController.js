const mongoose = require('mongoose')
const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken')


// To Create/Add User
const createUser = async (req, res) =>{
    try {
        let userData = req.body
        if(!userData) return res.status(400).json({status : false, message : "Please Fill Details.."})

        if(!userData.title) return res.status(400).json({status : false, message : "Please Fill Title.. (REQUIRED)"})
        if(typeof userData.title !== 'string') return res.status(400).json({status : false, message : "Title should be string"});
        let enm = ['Mr','Miss','Mrs'] // Single choice
        if(!enm.includes(userData.title)) return res.status(400).json({status : false, message : "Title not exist"})


        if(!userData.name) return res.status(400).json({status : false, message : "Please Fill Name.. (REQUIRED)"})
        let nameFormate = /^[A-Za-z]+$/ // this is for name validation
        if(typeof userData.name !== "string" || !nameFormate.test(userData.name)) return res.status(400).json({status : false, message : "Please Enter valid name"})
        if(userData.name.length < 2) return res.status(400).json({status : false, message : "Name Must Be Morethen 2 Chareactor"})

        if(!userData.phone) return res.status(400).json({status : false, message : "Please Fill Phone Number.. (REQUIRED)"})
        let numberFormate = /^\d{10}$/ // this is for number validation
        if(!numberFormate.test(userData.phone)) return res.status(400).json({status : false, message : "Please Enter Valid Phone Number"})
        let phone = await UserModel.find({phone : userData.phone})
        if(phone.length > 0) return res.status(400).json({status : false, message : "Phone Already Exist (Try With Another Phone Number)"})

        if(!userData.email) return res.status(400).json({status : false, message : "Please Fill Email.. (REQUIRED)"})
        let emailFormat = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // this is for email validation
        if(!emailFormat.test(userData.email)) return res.status(400).json({status : false, message : "Please Enter Valid Email"})
        let email = await UserModel.find({email : userData.email})
        if(email.length > 0) return res.status(400).json({status : false, message : "Email Already Exist (Try With Another Email)"})

        if(!userData.password) return res.status(400).json({status : false, message : "Please Fill Password.. (REQUIRED)"})
        if(userData.password.length < 8 || userData.password.length > 15) return res.status(400).json({status : false, message : "Password Must Be Minimum 8 Charectors And Maximum 15 Charectors"})

        let data = await UserModel.create(userData)
        return res.status(201).json({status : true, data : data})
    } catch (error) {
        return res.status(500).json({status : false, message : error.message})
    }
}




// To Login User
const userLogin = async (req, res) =>{
    try {
        let email = req.body.email
        let password = req.body.password

        // for email and password validate
        if(!email || !password){
            if(!email) return res.status(400).json({status : false, message : "Please enter your email ( कृपया अपना ईमेल डालें )"})
            if(!password) return res.status(400).json({status : false, message : "Please enter your password ( कृपया अपना पासवर्ड डालें ! )"})
        }

        let user  = await UserModel.findOne({email : email, password : password})

        // for user validate
        if(!user ){
            return res.status(400).json({status : false, message : "Email OR Password Is Incorrect ( आपका ईमेल या पासवर्ड गलत है, कृपया दोबारा प्रयास करें ! )"})
        }
        
        let data = jwt.sign({userId : user._id.toString()}, "secret-key")
        return res.status(201).json({status : true, data : {token : data}})
    } catch (error) {
        return res.status(500).json({status : false, message : error.message})
    }
}

module.exports = {
    createUser,
    userLogin
}