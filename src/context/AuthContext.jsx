import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return; // Only run once
    
    const token = localStorage.getItem('token');
    console.log('AuthContext initializing:', { hasToken: !!token });
    
    if (token) {
      fetch('http://localhost:5001/api/user/profile', {
        headers: { 'x-auth-token': token }
      })
        .then(res => {
          console.log('Profile response:', { status: res.status, ok: res.ok });
          return res.ok ? res.json() : null;
        })
        .then(data => {
          console.log('Profile data:', data);
          if (data && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        })
        .catch(error => {
          console.error('AuthContext: Error fetching profile:', error);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
          setInitialized(true);
        });
    } else {
      console.log('No token found, setting loading to false');
      setLoading(false);
      setInitialized(true);
    }
  }, [initialized]);

  // Enhanced setUser to handle logout
  const setUserAndToken = (userObj, token) => {
    setUser(userObj);
    if (userObj && token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: setUserAndToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 