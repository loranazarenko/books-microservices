import axios from 'axios';

const addResponseInterceptor = ({ onSignOut }) => {
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                onSignOut();
            }
            throw error;
        }
    );
};

axios.defaults.baseURL = '/';
axios.defaults.withCredentials = true;

export const booksAxios = axios.create({
    baseURL: '/',
    withCredentials: true,
});

const addAxiosInterceptors = ({ onSignOut }) => {
    addResponseInterceptor({ onSignOut });
};

export {
    addAxiosInterceptors,
};

export default axios;