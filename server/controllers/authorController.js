const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// register
const register = async (req, res) => {
    try {

        const {
            username,
            email,
            password
        } = req.body;

        // valid
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        // check user
        const [users] = await pool.execute(
            `
            SELECT id
            FROM users
            WHERE username = ?
            OR email = ?
            `,
            [
                username,
                email
            ]
        );

        if (users.length > 0) {
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }

        // encrypt password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // new users are visitors
        const role = "visitor";

        // insert user
        const [result] = await pool.execute(
            `
            INSERT INTO users (
                username,
                email,
                password,
                role
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                username,
                email,
                hashedPassword,
                role
            ]
        );

        res.status(201).json({
            message: "User registered successfully",
            data: {
                id: result.insertId,
                username,
                email,
                role
            }
        });

    } catch (error) {

        console.error(
            "Register error:",
            error
        );

        res.status(500).json({
            message: "Failed to register",
            error: error.message
        });
    }
};

// login

const login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // find user
        const [users] = await pool.execute(
            `
            SELECT *
            FROM users
            WHERE email = ?
            `,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // create token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successfully",

            token,

            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Failed to login",
            error: error.message
        });
    }
};

module.exports = {
    register,
    login
};