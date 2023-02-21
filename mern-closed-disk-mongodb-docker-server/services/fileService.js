import fs from "fs";

//функция создания папки в проекте
export const  createDir = (file) => {
    const filePath = `${process.env.filePath}\\${file.user}\\${file.path}`

    return new Promise(((resolve, reject) => 
    {
        try 
        {
            if (!fs.existsSync(filePath)) 
            {
                fs.mkdirSync(filePath)
                return resolve({message: "File was created"})
            } 
            else 
            {
                return reject({message: "File already exist"})
            }
        } 
        catch (e) 
        {
            return reject({message: "File error"})
        }
    }))
}

//функция удаления папки или файла из проекта
//the function of removing paper or files from project
export const deleteFile = (file) => {
    const path = getPath(file);

    if (file.type === "dir") 
    {
        fs.rmdirSync(path);
    } 
    else 
    {
        fs.unlinkSync(path)
    }
}

//функция определения пути к папке или к файлу в проекте
//the function of defining track to paper or file in project
export const  getPath = (file) => {
    return process.env.filePath + '\\' + file.user + '\\' + file.path;
}