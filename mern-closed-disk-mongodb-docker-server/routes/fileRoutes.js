import Router from "express";
const router = new Router();
import authMiddleware from "../middleware/authMiddleware.js";
import {fileController} from "../controllers/index.js";

//маршрутизатор создания папки
router.post('',authMiddleware,fileController.createDir);
//маршрутизатор  загрузки файла в браузер
router.post('/upload',authMiddleware,fileController.uploadFile);
//маршрутизатор  загрузки аватарки пользователя
router.post('/avatar',authMiddleware,fileController.uploadAvatar);
//маршрутизатор  получения файлов
router.get('',authMiddleware,fileController.getFiles);
//маршрутизатор загрузки файла на диск
router.get('/download',authMiddleware,fileController.downloadFile);
//маршрутизатор  поиска файла или папки
router.get('/search',authMiddleware,fileController.searchFile);
//маршрутизатор  удаления файла или папки
router.delete('/',authMiddleware,fileController.deleteFile);
//маршрутизатор  удаления аватарки пользователя
router.delete('/avatar',authMiddleware,fileController.deleteAvatar);

export default router;