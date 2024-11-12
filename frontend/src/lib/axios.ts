import axios from "axios";

/**
 * @description Axios instance with base URL set to the API base URL. Used for RESTful API requests.
 * @example api.post("/generator") - creates POST request to the API endpoint /generator to start the generation process.
 * */
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

/**
 * @description Axios instance with base URL set to the images API base URL. Used to fetch images from the images API.
 * @example imagesApi.get("/images") - fetches all images from the images API for the currently logged in user.
 *
 * */
export const imagesApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_IMAGES_API_BASE_URL
});

/**
 * Interceptor to append auth token and other credentials (cookies) to every request.
 * In case of a request error, reject the promise.
 * */
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined" ? sessionStorage.getItem("auth-token") : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Allow credentials to be sent with the request, manually set to false where they are not needed
        config.withCredentials = true;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Interceptor to handle authorization errors globally. In case of a 401 response, user will be redirected to the login page.
 * */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);