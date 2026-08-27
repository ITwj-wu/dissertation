const pool = require("../config/db");
const { marked } = require("marked");


// add new blog
const addBlog = async (req, res) => {
    try {
        const {
            title,
            type,
            content
        } = req.body;

        // vaild values
        if (!title || !type || !content) {
            return res.status(400).json({
                message: "title, type and content are required"
            });
        }

        // coverImg path
        let coverImage = null;

        if (req.file) {

            coverImage =
                `/uploads/covers/${req.file.filename}`;

        }

        // Markdown -> HTML
        const contentHtml = marked.parse(content);

        // insert database table
        const [result] = await pool.execute(
            `
            INSERT INTO blogs (
                title,
                type,
                content,
                content_html,
                cover_image
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                title,
                type,
                content,
                contentHtml,
                coverImage
            ]
        );

        res.status(201).json({
            message: "Blog created successfully",
            data: {
                id: result.insertId,
                title,
                type,
                content,
                content_html: contentHtml,
                cover_image: coverImage
            }
        });

    } catch (error) {
        console.error("Create blog error:", error);

        res.status(500).json({
            message: "Failed to add blog",
            error: error.message
        });
    }
};

// get list
const getBlogsList = async (req, res) => { 
    try { 

        const { type } = req.query;
        let sql = `
            SELECT *
            FROM blogs
        `;
        let params = [];
        // get blogs by category
        if (type) {
            sql += `
                WHERE type = ?
            `;
            params.push(type);
        }

        sql += `
            ORDER BY created_at DESC
        `;

        const [blogs] = await pool.execute(
            sql,
            params
        );

        res.status(200).json({ 
            message: "Blogs retrieved successfully", 
            data: blogs 
        }); 

    } catch (error) { 
        console.error("Get blogs list error:", error); 

        res.status(500).json({ 
            message: "Failed to get blogs list", 
            error: error.message 
        }); 
    } 
};

// get categories
const getCategories= async (req, res) => { 
    try { 

        // get categories list 
        const [categories] = await pool.execute( 
            ` 
            SELECT * 
            FROM categories
            ` 
        ); 

        res.status(200).json({ 
            message: "Categories retrieved successfully", 
            data: categories 
        }); 

    } catch (error) { 
        console.error("Get categories list error:", error); 

        res.status(500).json({ 
            message: "Failed to get categories list", 
            error: error.message 
        }); 
    } 
};

// search blogs by title
const searchBlogs = async (req, res) => {
    try {

        const { keyword } = req.query;

        // valid keyword
        if (!keyword || !keyword.trim()) {
            return res.status(400).json({
                message: "Search keyword is required"
            });
        }

        // fuzzy search by title
        const searchKeyword = `%${keyword.trim()}%`;

        const [blogs] = await pool.execute(
            `
            SELECT *
            FROM blogs
            WHERE title LIKE ?
            ORDER BY created_at DESC
            `,
            [searchKeyword]
        );

        res.status(200).json({
            message: "Blogs retrieved successfully",
            data: blogs
        });

    } catch (error) {
        console.error("Search blogs error:", error);

        res.status(500).json({
            message: "Failed to search blogs",
            error: error.message
        });
    }
};

module.exports = {
    addBlog,
    getBlogsList,
    getCategories,
    searchBlogs
};