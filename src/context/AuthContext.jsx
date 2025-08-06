import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        
        
        if (storedToken && storedUser) {
          // Set both token and user immediately from localStorage
          setTokenState(storedToken);
          try {
            const userData = JSON.parse(storedUser);
            setUserState(userData);
    
          } catch (e) {
            console.warn('Invalid stored user data, clearing');
            localStorage.removeItem('user');
          }
        }
        
        // Only try to validate token if we have one
        if (storedToken) {
          try {
            const response = await fetch('http://localhost:5001/api/user/profile', {
              headers: { 'x-auth-token': storedToken }
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data && data.user) {
                setUserState(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
        
              }
            } else if (response.status === 401) {
              console.warn('Token invalid, clearing auth');
              setUserState(null);
              setTokenState(null);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
            // For any other response, keep the existing auth state
          } catch (error) {
            console.warn('Network error during auth validation, keeping existing state');
            // Don't clear auth on network errors
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Enhanced setUser to handle logout
  const setUserAndToken = (userObj, newToken) => {

    setUserState(userObj);
    setTokenState(newToken);
    if (userObj && newToken) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userObj));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Function to refresh user data
  const refreshUser = async () => {
    if (!token) return false;
    
    try {
      const response = await fetch('http://localhost:5001/api/user/profile', {
        headers: { 'x-auth-token': token }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.user) {
          setUserState(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          return true;
        }
      } else if (response.status === 401) {
        // Only clear auth on definite 401
        setUserState(null);
        setTokenState(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      setUser: setUserAndToken, 
      refreshUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 