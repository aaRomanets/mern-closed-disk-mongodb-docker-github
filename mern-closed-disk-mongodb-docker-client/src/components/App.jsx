import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import  { useSelector}  from "react-redux";

import Navbar from "./navbar/Navbar";
import Registration from "./authorization/Registration";
import Login from "./authorization/Login";
import Disk from "./disk/disk";

import Profile from "./profile/Profile";

import "./app.css";

function App() {
  //проверяем авторизацию пользователя если она равна false то либо пользователя нет либо он не авторизован
  const isAuth = useSelector(state => {return state.user.isAuth;});

  return (
    <BrowserRouter>
      <div className="app">
        {<Navbar/>}
        <div className="wrap">
          {!isAuth ?(
            //регистрация или авторизация пользователя
            <Routes>
              <Route path="/registration" element={<Registration/>} />
              <Route path="/login" element={<Login/>} />
            </Routes>
          )
            :
          (  
            //проводим операции с файлами и папками по авторизованному пользователю 
            <Routes>
              <Route path="/" element={<Disk/>} />
              <Route path="/profile" element={<Profile/>}/>
            </Routes>
          )
          }
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
