import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/user/profile', {
        headers: { 'x-auth-token': token }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.user) setUser(data.user);
          else setUser(null);
        })
        .catch(() => setUser(null));
    }
  }, []);

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
    <AuthContext.Provider value={{ user, setUser: setUserAndToken }}>
      {children}
    </AuthContext.Provider>
  );
}; 