const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    addBlog,
    getBlogsList,
    getCategories,
    searchBlogs,
    deleteBlog,
    getBlogDetail,
    addComment,
    getCommentsByBlogId
} = require("../controllers/blogController");

const router = express.Router();


// upload dirtory
const uploadDir = path.join(
    __dirname,
    "..",
    "uploads",
    "covers"
);

// if dirtory not exit, auto build
if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

// config file save
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        const extension = path.extname(
            file.originalname
        );

        const fileName =
            Date.now()
            + "-"
            + Math.round(Math.random() * 1e9)
            + extension;

        cb(null, fileName);
    }
});


// limit only upload image
const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, PNG and WEBP images are allowed"
            ),
            false
        );
    }

};


const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


// POST add blogs
router.post(
    "/addBlog",
    upload.single("coverImage"),
    addBlog
);

// GET all blogs list
router.get(
    "/allBlogs",
    getBlogsList
);

// GET all blogs list
router.get(
    "/allCategories",
    getCategories
);

router.get (
    "/searchBlogs",
    searchBlogs
);

router.delete (
    "/deleteBlog/:id",
    deleteBlog
);

router.get (
    "/blogDetail/:id",
    getBlogDetail
);

// add comment
const authMiddleware =
    require("../middleware/authMiddleware");

router.post(
    "/comments",
    authMiddleware,
    addComment
);


// get comment
router.get (
    "/getComments/:id",
    getCommentsByBlogId
);
module.exports = router;