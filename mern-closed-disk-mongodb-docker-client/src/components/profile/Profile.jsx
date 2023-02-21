import React from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { deleteAvatar, uploadAvatar } from "../../actions/user";

import './profile.css'

//загрузчик аватарок
const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //создаем аватарку пользователя
    function changeHandler(e) {
        const file = e.target.files[0]
        dispatch(uploadAvatar(file))
    }

    return (
        <div>
            <div>
                <button className="on-main" onClick={() => navigate("/")}>On main</button>
                <button className="delete-avatar" onClick={() => dispatch(deleteAvatar())}>Remove uploadAvatar</button>
            
                <label htmlFor="avatar__upload-input" className="avatar__upload-label">Upload avatar</label>
                <input 
                    onChange={e => changeHandler(e)}
                    type="file" 
                    id="avatar__upload-input" 
                    className="avatar__upload-input"
                />
            </div>
        </div>
    )
}

export default Profile;