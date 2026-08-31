import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogDetail, addComment, getCommentsByBlogId } from "../../api/blog";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast/ToastContext";

import "./BlogDetail.scss";

const BlogDetail = () => {

    const toast = useToast();
    const navigate = useNavigate();
    const { id } = useParams();

    const {
        user,
        isLoggedIn,
        logout
    } = useAuth();

    const SERVER_URL =
        import.meta.env.VITE_SERVER_URL?.replace("/api", "");

    // state
    const [blogDetail, setBlogDetail] = useState(null);
    const [allComments, setAllComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);

    // get blog detail by id
    const getBlogDetailById = async () => {
        try {

            const result = await getBlogDetail(id);

            setBlogDetail(result.data);

        } catch (error) {
            console.error(
                "Get blog detail error:",
                error
            );
        }
    };

    // get comments
    const getComments = async() => {
        try {
            const result = await getCommentsByBlogId(id);

            setAllComments(result.data || []);

        } catch (error) {
            console.error(
                "Get blog comment error:",
                error
            );
        }
    };

    // add comment
   const handleAddComment = async () => {

        // not login
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        // empty comment
        if (!commentContent.trim()) {

            toast.open({
                type: "error",
                title: "Comment cannot be empty"
            });

            return;
        }

        try {
            await addComment({
                blog_id: id,
                content: commentContent.trim()
            });

            // refresh comments
            await getComments();

            // clear textarea
            setCommentContent("");

            toast.open({
                type: "success",
                title: "Added!",
                message: "Comment added successfully!"
            });

        } catch (error) {
            toast.open({
                type: "error",
                title: "Fail to add comment",
                message:
                    error.message
            });
        }
    };

    // click btn: login
    const handleGoLogin = () => {

        setShowLoginModal(false);

        navigate("/login");
    };

    // click btn: logout
    const handleLogout = () => {

        logout();

        toast.open({
            type: "success",
            title: "Logout",
            message:
                "Logout successfully!"
        });
    };

    // click btn: back
    const handleBack = () => {
        navigate("/");
    };

    // format date
    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date)
            .toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            );
    };

    // init page 
    useEffect(() => {
        getBlogDetailById();
        getComments();
    }, [id]);

    return (
        <div className="px-40 pb-5 flex justify-center">
            <div className="w-100">
                {/* blog detail */}
                <div className="two-card blog-detail">

                    {blogDetail && (

                        <div className="article">
                            <h1>{blogDetail.title}</h1>
                            <div className="blog-meta">
                                <span className="blog-category">{blogDetail.type}</span>
                                
                                <span className="blog-date">
                                    <i className="bi bi-calendar3"></i>
                                    {formatDate(
                                        blogDetail.created_at
                                    )}
                                </span>
                            </div>

                            {blogDetail.cover_image && (
                                <img
                                    src={`${SERVER_URL}${blogDetail.cover_image}`}
                                    alt={blogDetail.title}
                                    className="cover-image w-100"
                                />
                            )}

                            {/* content markdown -> html*/}
                            <div 
                                className="article-content"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        blogDetail.content_html
                                }}
                            />
                        </div>
                    )}

                </div>

                {/* comments list*/}
                <div className="two-card comment mt-3">

                    <h3 className="comment-title">
                        <i className="bi bi-chat"></i>
                        Comments
                    </h3>

                    <div className="comment-list">

                        {allComments.map(
                            (item) => (
                                <div
                                    key={item.id}
                                    className="comment-item"
                                >
                                    <div className="comment-avatar">
                                        {item.username
                                            ?.charAt(0)
                                            .toUpperCase()
                                        }
                                    </div>

                                    <div className="comment-content">
                                        <div className="comment-header flex justify-between items-center">
                                            <span className="comment-name">{item.username}</span>
                                            <span className="comment-date">
                                                {formatDate(
                                                    item.created_at
                                                )}
                                            </span>
                                        </div>

                                        <p className="comment-text">{item.content}</p>
                                    </div>
                                </div>
                            )
                        )}

                    </div>

                    {/* post comment */}
                    <h3 className="pt-3">
                        <i className="bi bi-brush"></i>
                        Leave a comment
                    </h3>

                    <textarea
                        value={commentContent}
                        onChange={(event) =>
                            setCommentContent(
                                event.target.value
                            )
                        }
                        className="form-control"
                        aria-label="With textarea"
                        placeholder="Add comment..."
                    />

                    <div className="flex justify-end">
                        <button
                            className="btn btn-pink w-40 mt-2"
                            onClick={
                                handleAddComment
                            }
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
            </div>

            {/* right buttonds */}
            <div>
                <button
                    className="btn btn-outline-pink back-btn"
                    onClick={handleBack}
                >
                    Back
                </button>

                {isLoggedIn ? (
                    <button
                        className="btn btn-outline-pink back-btn mt-2"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        className="btn btn-outline-pink back-btn mt-2"
                        onClick={() =>
                            setShowLoginModal(true)
                        }
                    >
                        Login
                    </button>
                )}
            </div>

            {/* login model */}
            {showLoginModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block"
                    }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Need Login</h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setShowLoginModal(
                                            false
                                        )
                                    }
                                />
                            </div>

                            <div className="modal-body">
                                You need to log in to post comments.
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setShowLoginModal(
                                            false
                                        )
                                    }
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={
                                        handleGoLogin
                                    }
                                >
                                    Go Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            )}

            {/* Modal backdrop */}
            {showLoginModal && (
                <div
                    className="modal-backdrop fade show"
                    onClick={() =>
                        setShowLoginModal(false)
                    }
                />

            )}
        </div>
    );
}

export default BlogDetail;