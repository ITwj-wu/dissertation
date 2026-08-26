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

module.exports = {
    addBlog
};