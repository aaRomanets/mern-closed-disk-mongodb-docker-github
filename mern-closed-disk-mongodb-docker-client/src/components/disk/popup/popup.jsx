import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";

import { createDir } from "../../../actions/file";
import { setPopupDisplay } from "../../../reducers/fileReducer";
import Input from "../../../utils/input/Input";

import "./popup.css";

const Popup = () => {
    //Имя новой папки
    const [dirName, setDirName] = useState(''); 
    const popupDisplay = useSelector(state => state.files.popupDisplay);
    //идентификатор текущей папки
    const currentDir = useSelector(state => state.files.currentDir); 

    const dispatch = useDispatch();

    //создаем новую папку в текущей папке
    function createHandler() {
        if (dirName !== "")
        {
            dispatch(createDir(currentDir,dirName));
            setDirName("");
        }
    }

    return (
        <div className="popup" onClick={() => dispatch(setPopupDisplay('none'))} style={{display: popupDisplay}}>
            <div className="popup__content" onClick={(event => event.stopPropagation())}>
                <div className="popup__header">
                    <div className="popup__title">Create new paper</div>
                    {/*скрываем окно создания папок*/}
                    <button className="popup__close" onClick={() => dispatch(setPopupDisplay('none'))}>X</button>
                </div>
                <Input type="text" placeholder="Enter the folder name..." value={dirName} setValue={setDirName}/>
                 {/*создаем папку*/}
                <button className="popup__create" onClick={() => createHandler()}>Создать</button>
            </div>
        </div>
    )
}

export default Popup;