import React, {useEffect, useState} from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';
import {
    useDispatch,
    useSelector,
} from 'react-redux';
import {addAxiosInterceptors} from 'misc/requests';
import * as pages from 'constants/pages';
import AuthoritiesProvider from 'misc/providers/AuthoritiesProvider';
import DefaultPage from 'pageProviders/Default';
import Loading from 'components/Loading';
import LoginPage from 'pageProviders/Login';
import PageContainer from 'pageProviders/components/PageContainer';
import pageURLs from 'constants/pagesURLs';
import SecretPage from 'pageProviders/Secret';
import ThemeProvider from 'misc/providers/ThemeProvider';
import UserProvider from 'misc/providers/UserProvider';

import actionsUser from '../actions/user';
import Header from '../components/Header';
import IntlProvider from '../components/IntlProvider';
import MissedPage from '../components/MissedPage';
import SearchParamsConfigurator from '../components/SearchParamsConfigurator';

import BooksList from '../../pageProviders/BooksList';
import BookDetail from '../../pageProviders/BookDetail'

function App() {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        componentDidMount: false,
    });

    const {
        isFetchingUser,
        isAuthorized,
    } = useSelector(({user}) => user);

    useEffect(() => {
        addAxiosInterceptors({
            onSignOut: () => dispatch(actionsUser.fetchSignOut()),
        });
        dispatch(actionsUser.fetchUser());
        setState((prev) => ({
            ...prev,
            componentDidMount: true,
        }));
    }, [dispatch]);

    if (!state.componentDidMount || isFetchingUser) {
        return (
            <ThemeProvider>
                <BrowserRouter>
                    <IntlProvider>
                        <Loading/>
                    </IntlProvider>
                </BrowserRouter>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <BrowserRouter>
                <IntlProvider>
                    <SearchParamsConfigurator/>
                    <UserProvider>
                        <AuthoritiesProvider>
                            {isAuthorized ? (
                                <>
                                    <Header/>
                                    <PageContainer>
                                        {isAuthorized ? (
                                        <Routes>
                                            <Route path={pageURLs[pages.defaultPage]} element={<BooksList />}/>
                                            <Route path="/" element={<BooksList />} />
                                            <Route path="/books" element={<BooksList />} />
                                            <Route path="/books/new" element={<BookDetail />} />
                                            <Route path="/books/:id" element={<BookDetail />} />
                                            <Route path={pageURLs.secret} element={<SecretPage/>}/>
                                            <Route path="*" element={<MissedPage/>}/>
                                        </Routes>
                                        ) : (
                                            <Routes>
                                                <Route path="*" element={<LoginPage />} />
                                            </Routes>
                                        )}
                                    </PageContainer>
                                </>
                            ) : (
                                <LoginPage/>
                            )}
                        </AuthoritiesProvider>
                    </UserProvider>
                </IntlProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
