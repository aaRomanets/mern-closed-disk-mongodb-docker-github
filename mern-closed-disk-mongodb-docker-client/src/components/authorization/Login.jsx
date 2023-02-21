import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Input from "../../utils/input/Input"
import { login } from "../../actions/user";

import "./authorization.css";

//авторизируем пользователя находим его почту и пароль в базе данных и определяем токен пользователя
const Login = () => 
{
    const [email, setEmail] = useState("");  
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const navigate = useNavigate();

    return (
        <div className="authorization">
            <div className="authorization__header">Authorization</div>
            <Input value={email} setValue={setEmail} type="text" placeholder="Enter email..." />
            <Input value={password} setValue={setPassword} type="password" placeholder="Enter password..." />
            {/*процесс авторизации*/}
            <button className="authorization__btn" onClick={() => dispatch(login(email, password, navigate))}>Enter</button>
        </div>
    )
}

export default Login;