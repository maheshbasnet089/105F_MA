const { users } = require("../model")
const bcrypt  = require('bcrypt')
const jwt = require("jsonwebtoken")

exports.registerUser = async(req,res)=>{
    const {email,password,username} = req.body
    await users.create({
        email,
        password : bcrypt.hashSync(password,8),
        username
    })
    res.status(200).json({
        message : "User registered successfully"
    })
}

exports.loginUser = async(req,res)=>{
    const {email,password} = req.body 
    const doesUserExistOfEmail = await users.findAll({
        where : {
            email
        }
    })
    if(doesUserExistOfEmail.length == 0 ){
        res.status(404).json({
            message : "No user exist with above email"
        })
    }else{
        const isPasswordAlsoMatched = bcrypt.compareSync(password,doesUserExistOfEmail[0].password)
        
        if(isPasswordAlsoMatched){
            const token = jwt.sign({id:doesUserExistOfEmail[0].id},'thisissecret')
            res.status(200).json({
                message : "User logged in success",
                token 
            })
        }else{
            res.status(400).json({
                message : "Password didnot matched"
            })
        }
    }
}