import React from "react";
import { useDispatch, useSelector } from "react-redux";

import UploadFile from "./UploadFile";
import { hideUploader } from "../../../reducers/uploadReducer";

import "./uploader.css"
 
//окно загрузки файлов
const UpLoader = () => {
    const files = useSelector(state => state.upload.files)
    //флаг появления окна загрузки файлов
    const isUpLoaderVisible = useSelector(state => state.upload.isVisible) 
    const dispatch = useDispatch()

    return ( isUpLoaderVisible && 
        <div className="uploader">
            <div className="uploader__header">
                <div className="uploader__title">Loading</div>
                {/*скрываем окно загрузки файлов*/}
                <button className="uploader__close" onClick={() => dispatch(hideUploader())}>X</button>
            </div>
            {files.map(file =>
                <UploadFile  key = {file.id} file={file} />
            )}
        </div>
    )
}

export default UpLoader;