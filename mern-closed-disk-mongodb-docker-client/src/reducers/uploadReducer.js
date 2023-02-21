const SHOW_UPLOADER = "SHOW_UPLOADER"
const HIDE_UPLOADER = "HIDE_UPLOADER"
const ADD_UPLOAD_FILE = "ADD_UPLOAD_FILE"
const REMOVE_UPLOAD_FILE = "REMOVE_UPLOAD_FILE"
const CHANGE_UPLOAD_FILE = "CHANGE_UPLOAD_FILE"

const defaultState = {
    isVisible: false,
    files: []
}

export default function userReducer(state = defaultState, action) {
    switch (action.type) {
        case SHOW_UPLOADER: return {...state, isVisible: true}
        case HIDE_UPLOADER: return {...state, isVisible: false}
        case ADD_UPLOAD_FILE:
            return {...state, files: [...state.files, action.payload]}
        case REMOVE_UPLOAD_FILE:
            return {...state, files: [...state.files.filter(file => file.name !== action.payload)]}
        case CHANGE_UPLOAD_FILE:
            return {
                ...state,
                files: [...state.files.map(file => file.name === action.payload.name 
                    ? {...file, progress: action.payload.progress}
                    : {...file}    
                )]
            }
        default:
            return state;
    }
}

//показываем окно загрузки файлов
export const showUploader = () => ({type: SHOW_UPLOADER})
//скрываем окно загрузки файлов 
export const hideUploader = () => ({type: HIDE_UPLOADER})
//в окно загрузки файлов добавляем загрузчик загружаемого файла
export const addUploadFile = (file) => ({type: ADD_UPLOAD_FILE, payload: file}) 
//из окна загрузки файлов удаляем загрузчик загружаемого файла
export const removeUploadFile = (fileName) => ({type: REMOVE_UPLOAD_FILE, payload: fileName})
//в окне загрузки файлов изменяем загрузчик загружаемого файла
export const changeUploadFile = (payload) => ({type: CHANGE_UPLOAD_FILE, payload: payload})