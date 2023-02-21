import axios from "axios"

import { API_URL } from "../config";
import { hideLoader, showLoader } from "../reducers/appReducer";
import {addFile, deleteFileAction, setFiles} from "../reducers/fileReducer";
import { addUploadFile, changeUploadFile } from "../reducers/uploadReducer";
import { setPopupDisplay } from "../reducers/fileReducer";

//функция получения файлов и папок из корневой дирректории и их сортировка по времени дате типу
export function getFiles(dirId, sort) { 
    return async dispatch => {
        try {
            //показываем колесо загрузки
            dispatch(showLoader());

            let url = `${API_URL}api/files`;
            if (dirId) {
                url = `${API_URL}api/files?parent=${dirId}`;
            }
            if (sort) {
                url = `${API_URL}api/files?sort=${sort}`;
            }
            if (dirId && sort) {
                url = `${API_URL}api/files?parent=${dirId}&sort=${sort}`;
            }

            //отправляем на сервер get запрос на получение отсортированных файлов и папок в текущей папке
            const response = await axios.get(url, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });

            //фиксируем отсортированные файлы
            dispatch(setFiles(response.data));
        } catch (e) {
            alert(e.response.data.message)
        } finally {
            //скрываем колесо загрузки
            dispatch(hideLoader())
        }
    }
}

//функция создания папки
export function createDir(dirId, name) {
    return async dispatch => {
        try {
            const response = await axios.post(`${API_URL}api/files`,{
                name,
                type: 'dir',
                parent: dirId
            }, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            //добавляем папку в текущую папку dirId
            dispatch(addFile(response.data));

            //скрываем окно создания папки
            dispatch(setPopupDisplay('none'));
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

//функция загрузки файла с компьютера
export function uploadFile(file, dirId) {
    return async dispatch => {
        try {
            const formData = new FormData();
            formData.append('file',file);
            if (dirId) {
                formData.append('parent',dirId);
            }
            //информация о загружаемом файле
            const uploadFile = {name: file.name, progress: 0, id: Date.now()}
            //в окно загрузки файлов добавляем загрузчик загружаемого файла
            dispatch(addUploadFile(uploadFile))

            const response = await axios.post(`${API_URL}api/files/upload`,formData, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                onUploadProgress: progressEvent => {
                    const totalLength = progressEvent.total;
                    //меняем загрузчик загружаемого файла в зависимости от того как файл загружается
                    if (totalLength) 
                    {
                        uploadFile.progress = Math.round((progressEvent.loaded*100)/totalLength);
                        dispatch(changeUploadFile(uploadFile))    
                    }
                }
            })
            //фиксируем загруженный файл
            dispatch(addFile(response.data));
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

//функция загрузки файла на компьютер с браузера
export async function downloadFile(file) {
    const response = await fetch(`${API_URL}api/files/download?id=${file._id}`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }        
    })
    if (response.status === 200) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();                       
    }
}

//функция удаления файла с браузера и из бекэнда
export function deleteFile(file) {
    return async dispatch => {
        try {
            const response = await axios.delete(`${API_URL}api/files?id=${file._id}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }                
            })
            dispatch(deleteFileAction(file._id));
            alert(response.data.message)            
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

//функция поиска файла по названию
export function searchFiles(search) {
    return async dispatch => {
        try {
            const response = await axios.get(`${API_URL}api/files/search?search=${search}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }                
            })
            //фиксируем найденный элемент   
            dispatch(setFiles(response.data));       
        } catch (e) {
            alert(e.response.data.message)
        } finally {
            dispatch(hideLoader())
        }
    }
}