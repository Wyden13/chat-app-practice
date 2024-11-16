//Routing is the way to defind how an application responds to client's requests for specific endpoints
//Router can be defined using HTTP methods GET, POST, PUT, DELETE,...

const express = require('express')
const { 
    registerUser,
    loginUser, 
    findUser, 
    getUsers
} = require("../controllers/userController")

const router = express.Router()

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/",getUsers)
// "/find" is a static segment
//  :userId is a route parameter, allows for dynamic values to be passed in the URL 
// :userId is a dynamic segment

module.exports = router;