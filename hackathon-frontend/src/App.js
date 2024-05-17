import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import Home from './screens/Home';
import Simulation from './screens/simulator/Simulation';
import Survey from './screens/simulator/Survey';
import Loading from './components/Loading';

//Auth
import Login from './screens/auth/Login';

import { auth } from '../src/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const NotFound = () => {
    return (
      <div className='not-found'>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {user == null ? (
            <Login />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/simulation" element={<Survey />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </>
      )}
    </>
  );
}

export default App;
