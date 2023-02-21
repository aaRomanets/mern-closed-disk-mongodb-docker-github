import React from "react";
import { useSelector } from "react-redux";
import {CSSTransition, TransitionGroup} from "react-transition-group";

import File from "./file/file";

import "./fileList.css";
import "../disk.css"

const FileList = () => 
{
    //файлы в текущей папке
    const files = useSelector(state => state.files.files);  
    //тип файловой структуры
    const fileView = useSelector(state => state.files.view);

    //файлов в текущей папке нет
    if (files.length === 0) {
        return (
            <div className="loader">
                Files not found
            </div>
        )
    }

    //выводим сетку файлов и папок в текущей папке
    if (fileView === "plate") {
        return (
            <div className="fileplate">
                {files.map(file => 
                    <File key={file._id} file={file}/>
                )}
            </div>
        )
    }

    //выводим список файлов и папок в текущей папке
    if (fileView === "list") {
        return (
            <div className="filelist">
                <div className="filelist__header">
                    <div className="filelist__name">Name</div>
                    <div className="filelist__date">Date</div>
                    <div className="filelist__size">Dimension</div>
                </div>
                <TransitionGroup>
                    {files.map(file => 
                        <CSSTransition 
                            key = {file._id}
                            timeout={500}
                            classNames={'file'}
                            exit = {false}
                        >
                            <File file={file}/>
                        </CSSTransition>
                    )}
                </TransitionGroup>
            </div>
        )
    }
}

export default FileList;