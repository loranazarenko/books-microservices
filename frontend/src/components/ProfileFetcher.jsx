import React, {useEffect, useState} from 'react';
import GoogleLogin from './GoogleLogin';

export default function ProfileFetcher({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/profile', {credentials: 'include'})
            .then(res => {
                if (res.status === 401) {
                    setUser(null);
                    setLoading(false);
                    return null;
                }
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                if (data) {
                    setUser(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Profile fetch error:', err);
                setUser(null);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>;
    }

    if (!user) {
        return <GoogleLogin />;
    }

    return children;
}