import axios from 'axios';
import storage, { keys } from '../storage';
import config from "../../config";

const addTokenInterceptor = (axiosInstance) => {
    axios.interceptors.request.use((params) => {
      const token = storage.getItem(keys.TOKEN);
      if (token) {
        params.headers.setAuthorization(`Bearer ${token}`);
      }
      return params;
    });
};

const addResponseInterceptor  = ({
  onSignOut,
}) => {
  axios.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response.data
        .some(beError => beError?.code === 'INVALID_TOKEN')
      ) {
        onSignOut();
      }
      throw error.response.data;
    }
  );
};
axios.defaults.baseURL = config.USERS_SERVICE;
addTokenInterceptor(axios);

export const booksAxios = axios.create({
    baseURL: config.BOOKS_SERVICE,
});
addTokenInterceptor(booksAxios);

const addAxiosInterceptors = ({ onSignOut }) => {
    addResponseInterceptor(axios, onSignOut);
    addResponseInterceptor(booksAxios, onSignOut);
};


export {
  addAxiosInterceptors,
};

export default axios;
