const User = require("../models/User.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    try {
        const { password, email } = req.body
        // 1 check if this email aready exist in our database
        const data = await User.findOne({ email })
        // 2 if yes send error
        if (data) {
            return res.status(409).json({ message: "email already exist", success: false })
        }
        // 3 if not present then run following code
        const hashPassword = await bcrypt.hash(password, 10)
        await User.create({ ...req.body, password: hashPassword })
        res.status(201).json({ message: "user register success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message, success: false })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        // 1 check if email exist in our databasse
        const data = await User.findOne({ email }) // if found will return object with all feidls

        // 2 if not present send error
        if (!data) {
            return res.status(401).json({ message: "email not found", success: false })
        }
        // 3 compare password
        const isValid = await bcrypt.compare(password, data.password)

        // 4 if password do not match send error
        if (!isValid) {
            return res.status(401).json({ message: "invalid password", success: false })
        }
        // 5 if  isActive false send error 
        if (!data.isActive) {
            return res.status(401).json({ message: "account blocked by admin", success: false })
        }

        // 6 if password matched login success

        // JWT Token think of as idcard
        const token = jwt.sign({ _id: data._id, name: data.name }, process.env.JWT_KEY, { expiresIn: "1d" })

        // In your server configuration
        res.cookie('token', token, {
            secure: process.env.NODE_ENV === 'production', // false in development, true in production
            httpOnly: true,
        });

        res.status(200).json({
            message: "user login success",
            data: { name: data.name, email: data.email },
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message, success: false })
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie("ADMIN")
        res.status(200).json({ message: "user logout success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message, success: false })
    }
} 