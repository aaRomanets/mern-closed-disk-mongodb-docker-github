import express from "express";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
//подключаем базу данных Mongo DB
mongoose.connect(process.env.MONGODB_URI != undefined ? process.env.MONGODB_URI : "mongodb://localhost:27017" , {
  dbName: process.env.DB_NAME != undefined ? process.env.DB_NAME : "DB",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => {
  console.log('Mongodb connected....');
})
.catch(err => console.log(err.message));

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db...');
});

mongoose.connection.on('error', err => {
  console.log(err.message);
});

import fileUpload from "express-fileupload";
import authRouter from "./routes/authRoutes.js";
import fileRouter from "./routes/fileRoutes.js";
const app = express();

import coreMiddleware from "./middleware/corsMiddleware.js";

app.use(fileUpload({}));
app.use(coreMiddleware);
app.use(express.json());
app.use(express.static("static"));

//подключаем маршрутизаторы авторизации или регистрации
app.use("/api/auth",authRouter);

//подключаем маршрутизаторы операций с папками и файлами при авторизованном пользователе
app.use("/api/files",fileRouter);

const start = async () => {
  try 
  {
    //слушаем сервер
    await app.listen(process.env.PORT || 3019, () => 
    {
      console.log("Server started on port ", process.env.PORT || 3019)
    })
  } 
  catch(error) 
  {
    console.error(error);
  }
}

start();