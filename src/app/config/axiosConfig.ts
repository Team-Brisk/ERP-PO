import { Credential } from "@/models/users";
import axios from "axios";
import MsgAlert from "@/utils/sweetAlert";

const _msg = new MsgAlert()
axios.defaults.timeout = 1000000;

const credential: Credential = JSON.parse(localStorage.getItem('Credential') || '{}');
if (credential.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${credential.token}`;
    // console.log('Set Authorization Header globally:', axios.defaults.headers.common['Authorization']);
} else {
    console.log('No Credential Data In Localstorage.');
}

axios.interceptors.request.use(
    (config) => {
        const updatedToken = JSON.parse(localStorage.getItem('Credential') || '{}')?.token;
        if (updatedToken) {
            config.headers['Authorization'] = `Bearer ${updatedToken}`;
        }
        // console.log('Interceptor Triggered:', config.url);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        // If the response is successful, just return it
        return response;
    },
    (error) => {
        // Check if the error is a 401 Unauthorized
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized (401): Redirecting to /login");

            // Clear credentials from localStorage
            localStorage.removeItem("Credential");
            // Redirect to login page
            _msg.confirm('Unauthorized (401)', "error", false).then((isConfirmed) => {
                if (isConfirmed) {
                    window.location.href = "/login";
                }
            })
        }
        return Promise.reject(error);
    }
);

export default axios;