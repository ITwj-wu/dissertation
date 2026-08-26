const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 测试服务器
app.get("/", (req, res) => {
    res.json({
        message: "Express API is running"
    });
});


// test mysql
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT DATABASE() AS database_name"
        );

        res.json({
            message: "Database connected successfully",
            database: rows[0].database_name
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(
        `Server running at http://localhost:${PORT}`
    );
});