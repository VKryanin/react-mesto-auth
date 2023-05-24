import { useNavigate, useLocation } from "react-router-dom";
import * as mestoAuth from '../utils/MestoAuth'
import { useState, useEffect } from "react";
import { Message } from "./Message";

export function Signin({ handleLogin }) {
    const { name, value } = e.target; 
    setFormValue({ 
        ...formValue, 
        [name]: value 
    }); 

    function handleSubmit(e) {
        e.preventDefault();
        onLogin({login, password});
        setFormValue({
            email: '',
            password: '',
        });
    }

    const handleChange = (e) => { 
        const { name, value } = e.target; 
        setFormValue({ 
            ...formValue, 
            [name]: value 
        }); 
    } 

    return (
        <div  className="authForm__container">
            <h2 className="authForm__title">Вход</h2>
            <form className="authForm__form" onSubmit={handleSubmit}>
                <input id="email" required name="email" type="email" autoComplete="login" value={formValue.email} placeholder="Email"
                    onChange={handleChange} />
                <input id="password" required name="password" type="password" autoComplete="current-password"
                    value={formValue.password} placeholder="Пароль" onChange={handleChange} />
                <div className="authForm__button-container">
                    <button type="submit" className="authForm__link">Войти</button>
                </div>
            </form>
        </div>
    )
} 