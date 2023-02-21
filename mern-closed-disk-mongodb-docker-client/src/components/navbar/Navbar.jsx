import React, { useState } from 'react';

import Logo from '../../assets/img/navbar-logo.svg'
import {NavLink} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {logout} from "../../reducers/userReducer";
import {getFiles, searchFiles } from '../../actions/file';
import { showLoader } from '../../reducers/appReducer';
import avatarLogo from "../../assets/img/avatar.svg";
import {API_URL} from "../../config"

import './navbar.css'

const Navbar = () => {
    //флаг авторизации текущего пользователя
    const isAuth = useSelector(state => state.user.isAuth);
    //текущая папка
    const currentDir = useSelector(state => state.files.currentDir);
    //текущей пользователь
    const currentUser = useSelector(state => state.user.currentUser);
    
    const dispatch = useDispatch();
    const [searchName, setSearchName] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(false);
    
    //определяем аватарку 
    const avatar = (
        currentUser !== undefined && 
        currentUser.avatar !== undefined && 
        currentUser.avatar !== null &&
        currentUser.avatar !== '')  ? 
    `${API_URL + currentUser.avatar}` : avatarLogo;

    // функция поиска файла или папки в текущей папке по введенному названию
    function searchChangeHandler(e) {
        setSearchName(e.target.value)
        if (searchTimeout !== false) {
            clearTimeout(searchTimeout)
        }
        dispatch(showLoader());
        if (e.target.value !== "") {
            setSearchTimeout(setTimeout((value) => {
                dispatch(searchFiles(value))
            }, 500, e.target.value))
        } else {
            dispatch(getFiles(currentDir))
        }
    }

    return (
        <div className="navbar">
            <div className="container">
                <img src={Logo} alt="" className="navbar__logo"/>
                <div className="navbar__header">MERN CLOUD</div>
                
                {/*поиск файла или папки по названию в текущей папке*/}
                {isAuth && <input 
                    value={searchName}
                    onChange={e => searchChangeHandler(e)}
                    className="navbar__search" 
                    type="text" 
                    placeholder="search for a file by name..."/>}

                {/*авторизируем пользователя*/}
                {!isAuth && <div className="navbar__login"><NavLink to="/login">Enter</NavLink></div> }

                {/*регистрируем пользователя*/}
                {!isAuth && <div className="navbar__registration"><NavLink to="/registration">Registration</NavLink></div> }
                
                {/*отменяем авторизацию пользователя*/}
                {isAuth && <div className="navbar__login" onClick={() => dispatch(logout()) }>Escape</div> }
                
                {/*изображаем аватарку пользователя*/}
                {isAuth && <NavLink to="/profile">
                    <img className="navbar__avatar" src={avatar} alt=""/>
                </NavLink>}
            </div>
        </div>
    );
};

export default Navbar;