const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");
const app = express();
const path = require("path");

const blogRoutes = require("./routes/blogRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// blog API
app.use("/api", blogRoutes);


//  allow access upload image
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(
        `Server running at http://localhost:${PORT}`
    );
});