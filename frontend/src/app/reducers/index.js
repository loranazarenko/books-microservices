import {combineReducers} from 'redux';

import user from './user';
import booksReducer from './books';
import notificationReducer from './notificationReducer';

export default combineReducers({
    user,
    books: booksReducer,
    notification: notificationReducer,
});
