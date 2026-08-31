import { useEffect, useState } from "react";
import { getBlogsList, getCategories, searchBlogs, deleteBlog } from "../../api/blog";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.scss"
import { useToast } from "../../components/Toast/ToastContext";
import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
    // user state
    const {
        user,
        isLoggedIn,
        isAdmin,
        logout
    } = useAuth();

    const navigate = useNavigate();

    const [searchText, setSearchText] = useState("");
    const [activeCategory, setActiveCategory] = useState("");
    const [allBlogs, setAllBlogs] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [deleting, setDeleting] =  useState(false);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL?.replace("/api", "");
    const toast = useToast();

    // get all blogs
    const getBlogs = async (category = activeCategory) => {

        try {

            setLoading(true);
            const result =await getBlogsList(category);

            setAllBlogs(result.data || []);

        } catch (error) {
            console.error(
                "Get blogs error:",
                error
            );
        } finally {
            setLoading(false);

        }
    };

    // search blogs by title
    const handleSearch = async () => {

        try {

            if (!searchText.trim()) {

                await getBlogs();
                return;
            }

            setLoading(true);

            const result = await searchBlogs(searchText.trim());

            setAllBlogs(
                result.data || []
            );

        } catch (error) {

            console.error(
                "Search blogs error:",
                error
            );

        } finally {
            setLoading(false);
        }
    };

    // click category
    const handleClickCategory = async (name) => {

        setActiveCategory(name);

        await getBlogs(name);
    };

    // init page: get categories & blog list
    const initPage = async () => {

        try {

            const result = await getCategories();
            const categories = result.data || [];

            setAllCategories(categories);

            if (categories.length > 0) {

                const firstCategory =categories[0].name;

                setActiveCategory(firstCategory);

                await getBlogs(firstCategory);
            }

        } catch (error) {

            console.error(
                "Init page error:",
                error
            );
        }
    };


    // click btn: post
    const handleClickPost = () => {
        navigate("/addNewBlog");
    };

    // click btn: view post
    const handleClickViewPost = (id) => {
        navigate(`/blogDetail/${id}`);
    };
    
    // click btn: edit
     const handleClickEdit = (id) => {
        navigate(`/addNewBlog/${id}`);
    };

    // click delete
    const handleDeleteBtn = (blog) => {
        setSelectedBlog(blog);
    };

    const handleDelete = async () => {

        if (!selectedBlog) {
            return;
        }

        try {

            setDeleting(true);

            await deleteBlog(selectedBlog.id);

            await getBlogs();

            setSelectedBlog(null);

            toast.open({
                type: "success",
                title: "Deleted!",
                message:
                    "The blog has been deleted successfully."
            });

        } catch (error) {

            toast.open({
                type: "error",
                title: "Delete failed",
                message: error.message
            });

        } finally {

            setDeleting(false);
        }
    };

    // login
    const handleGoLogin = () => {
        navigate("/login");
    }

    // logout
    const handleLogout = () => {
        logout();

        toast.open({
            type: "success",
            title: "Logout",
            message: "Logout successfully!"
        });
    }

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

        initPage();

    }, []);

    return (
        <div className="homepage">
            {/* header */}
            <div className="header flex items-center justify-between mb-3 ">
                <h3 className="title">
                    Iris Notes
                </h3>
                <div className="header-right flex">
                    <Link className="about-link" to="/about">
                        About me
                    </Link>
                    {/* post btn */}
                    {isAdmin && (
                        <button
                            type="button"
                            className="btn-post btn btn-pink"
                            onClick={
                                handleClickPost
                            }
                        >
                            + Post
                        </button>
                    )}
                        {/* login */}
                        {!isLoggedIn && (
                            <button className="btn btn-outline-pink" onClick={handleGoLogin}>Login</button>
                        )}
                        
                        {/* show current user */}
                        {isLoggedIn && (
                            <div className="user-area flex">
                                <div className="username px-4 text-2xl">
                                    {user?.username}
                                </div>
                                <button
                                    className="btn btn-outline-pink"
                                    onClick={
                                        handleLogout
                                    }
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                </div>
            </div>
            {/* carousel */}
            <div className="carousel-content">
                <div
                    id="carouselExampleCaptions"
                    className="carousel slide"
                    data-bs-ride="carousel"
                >
                    <div className="carousel-indicators">
                        <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="0"
                            className="active"
                            aria-current="true"
                            aria-label="Slide 1"
                        />
                        <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="1"
                            aria-label="Slide 2"
                        />
                        <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="2"
                            aria-label="Slide 3"
                        />
                        <button
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to="3"
                            aria-label="Slide 4"
                        />
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img
                                src="/src/assets/imgs/ceramic.png"
                                className="d-block w-100"
                                alt="ceramic"
                            />
                        </div>
                        <div className="carousel-item">
                            <img
                                src="/src/assets/imgs/nail.png"
                                className="d-block w-100"
                                alt="nail"
                            />
                        </div>
                        <div className="carousel-item">
                            <img
                                src="/src/assets/imgs/tea.png"
                                className="d-block w-100"
                                alt="tea"
                            />
                        </div>
                        <div className="carousel-item">
                            <img
                                src="/src/assets/imgs/guzheng.png"
                                className="d-block w-100"
                                alt="guzheng"
                            />
                        </div>
                    </div>

                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="prev"
                    >
                        <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                        />
                        <span className="visually-hidden">
                            Previous
                        </span>
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="next"
                    >
                        <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                        />
                        <span className="visually-hidden">
                            Next
                        </span>
                    </button>
                </div>
            </div>

            {/* categories & search*/}
            <div className="flex justify-between mb-4">
                <nav className="categories flex items-end">
                    {allCategories.map(
                        (item) => (

                            <button
                                key={item.id}
                                className={
                                    activeCategory === item.name
                                        ? "category-item active"
                                        : "category-item"
                                }
                                onClick={() =>
                                    handleClickCategory(
                                        item.name
                                    )
                                }
                            >
                                {item.name}
                            </button>

                        )
                    )}

                </nav>
                <div className="search input-group">
                    <input
                        value={searchText}
                        onChange={(event) =>
                            setSearchText(
                                event.target.value
                            )
                        }
                        type="text"
                        className="form-control"
                        placeholder="search..."
                    />
                    <i
                        className="bi bi-search input-group-text search-icon"
                        onClick={handleSearch}
                    />
                </div>
            </div>
            
            {/* blog list */}
            <div className="blog-list">
                {loading && (
                    <div className="blog-loading">
                        <div
                            className="spinner-border"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>
                    </div>

                )}
                {allBlogs.map(
                    (blog) => (
                        <div
                            key={blog.id}
                            className="blog-card"
                            style={{
                                backgroundImage:
                                    `url(${SERVER_URL}${blog.cover_image})`
                            }}
                        >
                            <div className="blog-overlay">
                                <h2>
                                    {blog.title}
                                </h2>
                                <p className="date">
                                    {formatDate(
                                        blog.created_at
                                    )}
                                </p>

                                <div className="card-actions">
                                    <button
                                        className="btn btn-pink"
                                        onClick={() =>
                                            handleClickViewPost(
                                                blog.id
                                            )
                                        }
                                    >
                                        View Post
                                    </button>

                                    {isAdmin && (
                                        <button
                                            className="btn btn-outline-pink"
                                            onClick={() =>
                                                handleClickEdit(
                                                    blog.id
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                    )}
                                    {isAdmin && (
                                        <button
                                            className="btn btn-outline-pink"
                                            onClick={() =>
                                                handleDeleteBtn(
                                                    blog
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* no data */}

            {!loading &&
                allBlogs.length === 0 && (

                <div className="no-data">

                    <img
                        src="/src/assets/imgs/no-data.png"
                        width="200"
                        alt="No data"
                    />

                </div>

            )}

            {/* delete modal */}

            {selectedBlog && (

                <div
                    className="modal fade show delete-modal"
                    style={{
                        display: "block"
                    }}
                    tabIndex="-1"
                >

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h1 className="modal-title fs-5">
                                    {selectedBlog.title}
                                </h1>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setSelectedBlog(
                                            null
                                        )
                                    }
                                />

                            </div>

                            <div className="modal-body">

                                Are you sure you want
                                to delete this item?

                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setSelectedBlog(
                                            null
                                        )
                                    }
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    disabled={deleting}
                                    onClick={
                                        handleDelete
                                    }
                                >
                                    {deleting
                                        ? "Deleting..."
                                        : "Sure"
                                    }
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

            {/* Modal backdrop */}
            {selectedBlog && (

                <div
                    className="modal-backdrop fade show"
                    onClick={() =>
                        setSelectedBlog(null)
                    }
                />

            )}

        </div>
    );
};

export default HomePage;