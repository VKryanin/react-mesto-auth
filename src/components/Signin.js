import { useNavigate, useLocation } from "react-router-dom";
import * as mestoAuth from '../utils/MestoAuth'
import { useState, useEffect } from "react";
import { Message } from "./Message";

export function Signin({ handleLogin }) {
    const [formValue, setFormValue] = useState({
        email: '',
        password: ''
    });
    const [status, setStatus] = useState('')
    const [style, setStyle] = useState({ display: 'none' })
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const tokenCheck = () => {
        const jwt = localStorage.getItem('jwt');

        if (jwt) {
            mestoAuth.getContent(jwt)
                .then(user => {
                    const url = location.state?.backUrl || '/content';
                    handleLogin(user)
                    navigate(url)
                })
                .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        tokenCheck()
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({
            ...formValue,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formValue.password || !formValue.email) {
            setErrorMessage('Both fields are required');
            return;
        }

        const { email, password } = formValue;


        mestoAuth.authorize(email, password)
            .then(data => {
                if (data.token) {
                    localStorage.setItem('jwt', data.token);
                    localStorage.setItem('user', email);
                    handleLogin({ email, password });
                    const url = location.state?.backUrl || '/content';
                    navigate(url);
                    console.log({ email, password });
                }
            })
            .catch(err => {
                setStatus(false);
                setErrorMessage('Не корректный Email или пароль');
                setStyle({
                    display: 'block'
                });
            });
    }

    return (
        <div onSubmit={handleSubmit} className="authForm__container">
            <Message status={status} styles={style} error={errorMessage} />
            <h2 className="authForm__title">Вход</h2>
            <form className="authForm__form">
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