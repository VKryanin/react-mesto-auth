import React, { useEffect } from "react";
import Content from "./Content";
import { Header } from "./Header";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Signin } from "./Signin";
import { Signup } from "./Signup";
import { ProtectedRoute } from "./ProtectedRoute";
import { useState } from "react";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  

  const handleLogin = () => {
    setLoggedIn(true);
  }

  function handleExit() {
    localStorage.clear()
    setLoggedIn(false)
  }

  

  return (
    <>
      <Routes>
        <Route path="/content" element={<Header handleEvent={handleExit} title={'Выход'} />} />
        <Route path="/sign-up" element={<Header handleEvent={() => { navigate('/sign-in') }} title={'Войти'} />} />
        <Route path="/sign-in" element={<Header handleEvent={() => { navigate('/sign-up') }} title={'Регистрация'} />} />
      </Routes>
      <Routes>
        <Route path="/content" element={<ProtectedRoute element={Content} loggedIn={loggedIn} />} />
        <Route path="/sign-in" element={
          <div className="authForm">
            <Signin handleLogin={handleLogin} />
          </div>} />
        <Route path="/sign-up" element={
          <div className="authForm">
            <Signup />
          </div>} />
        <Route path="/" element={loggedIn ? <Navigate to='/content' /> : <Navigate to='/sign-in' replace />} />
      </Routes>
    </>
  )
}

export default App;