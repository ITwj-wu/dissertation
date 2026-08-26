const BASE_URL = "http://localhost:8080/api";

export const request = async (
    url,
    options = {}
) => {
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