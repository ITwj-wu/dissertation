const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const request = async (
    url,
    options = {}
) => {

    console.log("BASE_URL:", BASE_URL);
        console.log("Request URL:", `${BASE_URL}${url}`);
    try {
        const response = await fetch(
            `${BASE_URL}${url}`,
            options
        );

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(
                data.message || "Request failed"
            );
        }

        return data;

    } catch (error) {
        console.error("API Request Error:", error);
        throw error;
    }
};