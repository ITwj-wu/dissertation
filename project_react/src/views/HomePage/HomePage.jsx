import { useEffect } from "react";
import { getBlogsList, getCategories } from "../../api/blog";

const HomePage = () => {

    useEffect(() => {

        const testApi = async () => {

            const blogs = await getBlogsList();

            console.log("blogs:", blogs);

            const categories =
                await getCategories();

            console.log(
                "categories:",
                categories
            );
        };

        testApi();

    }, []);


    return (
        <div>
            API Test
        </div>
    );
};

export default HomePage;