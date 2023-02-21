import axios from "axios"

import { API_URL } from "../config";
import {setUser} from "../reducers/userReducer";

//функция регистрации пользователя
export const registration = async (email, password, navigate) => {
    try {
        const response = await axios.post(`${API_URL}api/auth/registration`, {email,password})
        //пользователь успешно зарегистрировался
        if (response.data.message === "User was created") 
        {
            // переходим на страницу авторизации
            navigate('/login');
        }
    } catch (e) {
        alert(e.response.data.message)
    }
}

//функция авторизации пользователя
export const login = (email, password, navigate) => {
    return async dispatch => {
        try {
            const response = await axios.post(`${API_URL}api/auth/login`, {email,password})
            //фиксируем токен пользователя
            localStorage.setItem('token',response.data.token);
            //сигнализируем о том, что авторизация пользователя прошла успешно
            dispatch(setUser(response.data.user)); 
            navigate('/');
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

//функция загрузки аватарки пользователя
export const uploadAvatar = (file) => 
{
    return async dispatch => 
    {
        try 
        {
            const formData = new FormData()
            formData.append('file',file)
            const response = await axios.post(`${API_URL}api/files/avatar`, formData, 
                {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
            )
            //сигнализируем о том что аватарка изменилась
            dispatch(setUser(response.data)); 
        } catch (e) {
            console.log(e)
        }
    }
}

//функция удаления аватарки пользователя
export const deleteAvatar = () => {
    return async dispatch => {
        try {
            const response = await axios.delete(`${API_URL}api/files/avatar`,
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
                }
            )
            dispatch(setUser(response.data))
        } catch (e) {
            console.log(e)
        }
    }
}