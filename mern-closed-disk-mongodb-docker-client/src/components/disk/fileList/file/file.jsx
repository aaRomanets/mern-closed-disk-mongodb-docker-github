import React from "react";
import { useDispatch, useSelector } from "react-redux";

import dirLogo from "../../../../assets/img/dir.svg";
import fileLogo from "../../../../assets/img/file.svg";
import { pushToStack, setCurrentDir } from "../../../../reducers/fileReducer";
import { deleteFile, downloadFile } from "../../../../actions/file";
import sizeFormat from "../../../../utils/sizeFormat";

import "./file.css";

const File = ({file}) => {
    const dispatch = useDispatch();
    //фиксируем идентификатор текущей папки по авторизированному пользователю
    const currentDir = useSelector(state => state.files.currentDir);
    //фиксируем вид размещения файлов и папок
    const fileView = useSelector(state => state.files.view)

    //открываем папку в текущей папке
    function openDirHandler(file) {
        if (file.type === 'dir') {
            dispatch(pushToStack(currentDir))
            dispatch(setCurrentDir(file._id))
        }
    }

    function downloadClickHandler(e) {
        e.stopPropagation()
        downloadFile(file);
    }

    function deleteClickHandler(e) {
        e.stopPropagation()
        dispatch(deleteFile(file))
    }

    if (fileView === "list") {
        return (
            <div className="file-list" >                
                <img 
                    src={file.type === "dir" ? dirLogo : fileLogo} 
                    onClick={()=> openDirHandler(file)} 
                    alt="" 
                    className="file-list__img"
                />
                
                <div className="file-list__name">{file.name}</div>
                <div className="file-list__date">{file.date.slice(0,10)}</div>
                <div className="file-list__size">{sizeFormat(file.size)}</div>

                {file.type !== "dir" &&
                    //выгружаем файл в загрузки
                    <button onClick={(e) => downloadClickHandler(e)} className="file-list__btn file-list__download">
                        download
                    </button>
                }
                {/*удаляем файл*/}
                <button onClick={(e) => deleteClickHandler(e)} className="file-list__btn file-list__delete">delete</button>                
            </div>
        )
    }

    if (fileView === "plate") {
        return (
            <div className="file-plate" onClick={()=> openDirHandler(file)}>
                <img src={file.type === "dir" ? dirLogo : fileLogo} alt="" className="file-plate__img"/>
                <div className="file-plate__name">{file.name}</div>
                {file.type !== "dir" && 
                    //выгружаем файл в загрузки
                    <button 
                        onClick={(e) => downloadClickHandler(e)} 
                        className="file-plate__btn file-plate__download"
                    >
                        download
                    </button>
                }
                {/*удаляем файл*/}
                <button 
                    onClick={(e) => deleteClickHandler(e)} 
                    className="file-plate__btn file-plate__delete"
                >
                    delete
                </button>
            </div>
        )
    }
}

export default File;