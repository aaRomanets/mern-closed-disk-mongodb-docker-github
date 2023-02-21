const SHOW_LOADER = "SHOW_LOADER";
const HIDE_LOADER = "HIDE_LOADER";

const defaultState = {
    loader: false
}

export default function userReducer(state = defaultState, action) {
    switch (action.type) {
        case SHOW_LOADER: return {...state, loader: true}
        case HIDE_LOADER: return {...state, loader: false}
        default:
            return state;
    }
}

// показаваем пиктограмму загрузки файлов в текущую папку из базы данных
export const showLoader = () => ({type: SHOW_LOADER}) 
// скрываем пиктограмму загрузки файлов 
export const hideLoader = () => ({type: HIDE_LOADER}) 