const { isValidRequest,
    isValidString,
    isValidName,
    isValidMail,
    isValidPhone,
    isValidPassword,
    isValidPincode,
    isValidId,
    isValidTitle,
    isValidPrice,
    isValidSize,
    isValidValue
} = require("../validators/validation")

const jwt = require("jsonwebtoken")

const adminModel = require("../models/adminModel")

const adminLogin = async function (req, res) {
    try {
        const adminCredentials = req.body

        if (!isValidRequest(adminCredentials)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Please provide login credentials`
                })
        }

        const { email, password } = adminCredentials

        if (!email) {
            return res
                .status(400)
                .send({ status: false, message: "Email is required" });
        }

        if (!isValidString(email) || !isValidMail(email)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter email in proper format" });
        }

        if (!password) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: "Password is required"
                });
        }
        if (!isValidString(password) || !isValidPassword(password)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message:
                        "Password should contain min 8 and max 15 character with a number and a special character",
                });
        }

        const admin = await adminModel.findOne({ email })

        if (!admin) {
            return res
                .status(400)
                .send({
                    status: false,
                    message:
                        "You are not Admin, you can't access this",
                });
        }

        const token = jwt.sign({
            adminId: admin._id.toString()
        },
            process.env.JWT_SECRET_KEY
        )

        return res
            .status(200)
            .send({
                status: true,
                data: token
            })

    }
    catch (err) {
        return res
            .status(500)
            .send({
                status: false,
                message: err.message
            })
    }
}





const createAdmin = async function (req, res) {
    try {
        const adminData = req.body

        if (!isValidRequest(adminData)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Please provide login credentials`
                })
        }

        const { fname, lname, email, password } = adminData

        if (!fname) {
            return res
                .status(400)
                .send({ status: false, message: "First Name is required" });
        }

        if (!isValidString(fname) || !isValidName(fname)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter first name is required" });
        }

        if (!lname) {
            return res
                .status(400)
                .send({ status: false, message: "Last Name is required" });
        }

        if (!isValidString(lname) || !isValidName(lname)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter last name is required" });
        }

        if (!email) {
            return res
                .status(400)
                .send({ status: false, message: "Email is required" });
        }

        if (!isValidString(email) || !isValidMail(email)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter email in proper format" });
        }

        const isDuplicateEmail = await adminModel.findOne({ email });
        if (isDuplicateEmail) {
            return res
                .status(409)
                .send({
                    status: false,
                    message: `EmailId already in use`
                });
        }

        if (!password) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: "Password is required"
                });
        }
        if (!isValidString(password) || !isValidPassword(password)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message:
                        "Password should contain min 8 and max 15 character with a number and a special character",
                });
        }
        const newAddedAdmin = await adminModel.create(adminData)
        return res
            .status(201)
            .send({
                status: true,
                data: newAddedAdmin
            })
    }
    catch (err) {
        return res
            .status(500)
            .send({
                status: false,
                message: err.message
            })
    }
}

const adminPanel = async function (req, res) {
    try {
        const adminId = req.token.adminId
        const adminData = await adminModel.findById(adminId)
        return res
            .status(200)
            .send({
                status: true,
                data: adminData
            })
    }
    catch (err) {
        return res
            .status(500)
            .send({
                status: false,
                message: err.message
            })
    }
}

module.exports = { adminLogin, createAdmin, adminPanel }