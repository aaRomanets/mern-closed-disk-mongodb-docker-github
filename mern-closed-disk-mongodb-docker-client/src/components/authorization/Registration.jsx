import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../utils/input/Input"
import { registration } from "../../actions/user";

import "./authorization.css";

//регистрируем пользователя заносим его почту и пароль в базу данных
//в случае успешной регистрации перемещаемся на страницу авторизации
const Registration = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    return (
        <div className="authorization">
            <div className="authorization__header">Registration</div>
            <Input value={email} setValue={setEmail} type="text" placeholder="Enter email..."/>
            <Input value={password} setValue={setPassword} type="password" placeholder="Enter password..."/>
            {/*процесс регистрации*/}
            <button className="authorization__btn" onClick={() => registration(email,password, navigate)}>Register</button>
        </div>
    )
}

export default Registration;