import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {getFiles, uploadFile} from "../../actions/file";
import FileList from "./fileList/fileList";
import Popup from "./popup/popup";
import { setCurrentDir, setPopupDisplay, setFileView } from "../../reducers/fileReducer";

import UpLoader from "./upLoader/UpLoader";
import { showUploader } from "../../reducers/uploadReducer";

import "./disk.css";

const Disk = () => {
    const dispatch = useDispatch();

    //идентификатор текущей директории
    const currentDir = useSelector(state => state.files.currentDir);        
    //флаг загрузки файлов в текущей директории
    const loader = useSelector(state => state.app.loader);                 
    //стек директорий 
    const dirStack = useSelector(state => state.files.dirStack);           
    //флаг переноса файла
    const [dragEnter, setDragEnter] = useState(false);                     
    //тип сортировки файлов в текущей директории
    const [sort, setSort] = useState("type");                              
    //флаг показа загрузчика файлов 
    const isUpLoaderVisible = useSelector(state => state.upload.isVisible) 

    useEffect(() => {
        dispatch(getFiles(currentDir,sort));
    }, [dispatch,currentDir,sort]);

    function showPopupHandler() {
        dispatch(setPopupDisplay("flex"));
    }

    function backClickHandler() {
        const backDirId = dirStack.pop();
        dispatch(setCurrentDir(backDirId));
    }

    //функция загрузки файла
    function fileUploadHandler(event){
        const files = [...event.target.files];
        if (files.length>0)
        {
            if (isUpLoaderVisible === false) 
            {
                dispatch(showUploader());
            }
            files.forEach(file => dispatch(uploadFile(file, currentDir)));
        }
    }

    //начало процесса перетаскивания файла
    function dragEnterHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(true);    
    }

    //конец процесса перетаскивания файла
    function dragLeaveHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(false);    
    }

    //функция добавления файла при перетаскивании
    function dropHandler(event) { 
        event.preventDefault();
        event.stopPropagation();
        let files = [...event.dataTransfer.files]
        files.forEach(file => dispatch(uploadFile(file,currentDir)))
        setDragEnter(false)
    }

    //пока файла не загрузились показываем пиктограмму загрузки
    if(loader) { 
        return (
            <div className="loader">
                <div className="lds-dual-ring"></div>
            </div>
        )
    }

    return ( !dragEnter ?
        <div className="disk" 
            onDragEnter={dragEnterHandler} 
            onDragLeave={dragLeaveHandler} 
            onDragOver={dragEnterHandler}
        >
            <div className="disk__btns">
                {/*переход между текущими папками*/}
                <button className="disk__back" onClick={() => backClickHandler()}>Back</button>
                {/*показываем окно создания папок*/}
                <button className="disk__create" onClick={() => showPopupHandler()}>Create paper</button>
                {/*Загрузка файла. При выборе файла отображается окно загрузчи.  В этом окне появляется загрузчик выбранного файла*/}
                <>
                    <label htmlFor="disk__upload-input" className="disk__upload-label">Upload file</label>
                    <input 
                        multiple={true} 
                        onChange={(event) => fileUploadHandler(event)} 
                        type="file" 
                        id="disk__upload-input" 
                        className="disk__upload-input"
                    />
                </>
                <select 
                    value={sort} 
                    onChange={(e) => {setSort(e.target.value)}} 
                    className="disk__select"
                >
                    <option value="name">On name</option>
                    <option value="type">On type</option>
                    <option value="date">On date</option>
                </select>
                {/* Включаем сеточное распределение файлов и папок в текущей папке*/}
                <button className="disk__plate" onClick={() => dispatch(setFileView("plate"))}/>
                {/* Показываем список загруженных файлов и папок в текущей папке*/}
                <button className="disk__list" onClick={() => dispatch(setFileView("list"))}/>
            </div>
            {/* список загруженных файлов и папок в текущей папке*/}
            <FileList/>
            {/* Окно создания папок в текущей папке*/}
            <Popup/>
            {/*Окно загрузки файла*/}
            <UpLoader/>
        </div>
        : 
        <div className="drop-area" 
            onDrop={dropHandler} 
            onDragEnter={dragEnterHandler} 
            onDragLeave={dragLeaveHandler}
            onDragOver={dragEnterHandler}
        >
            Drag and drop files here
        </div>
    )
}

export default Disk;