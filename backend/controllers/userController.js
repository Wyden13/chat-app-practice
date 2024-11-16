const userModel = require("../models/userModel");
const bcrypt = require("bcrypt"); // provide a secure and fast way to hash password with Node.js
const validator = require("validator")
const jwt = require("jsonwebtoken")

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;

    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" })
}

//User Register API
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //check if req.email is unique
        let user = await userModel.findOne({ email });

        //if user exists, return status code 400, 
        if (user) return res.status(400).json("User with the given email already exist");

        // check if either of fields is empty, then require user to fill 
        if (!name || !email || !password)
            return res.status(400).json("All fields are required!");

        // check if the email is valid
        if (!validator.isEmail(email))
            return res.status(400).json("Email must be a valid a email..");

        // check if the password is strong
        if (!validator.isStrongPassword(password))
            return res.status(400).json("Password must be strong..");

        user = new userModel({ name, email, password })

        // hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name, email, token });
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
};

//User login API
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await userModel.findOne({ email })
        if (!user)
            return res.status(400).json("Invalid email or password");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
            return res.status(400).json("Invalid email or password");

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name: user.name, email, token });

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

//Fetching user API

//Getting single user
const findUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await userModel.findById(userId);

        res.status(200).json(user);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

// get user
const getUsers = async (req, res) => {

    try {
        const users = await userModel.find();

        res.status(200).json(user);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}


module.exports = { registerUser, loginUser, findUser, getUsers }