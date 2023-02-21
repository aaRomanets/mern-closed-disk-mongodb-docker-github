import Router from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {check, validationResult} from "express-validator";
const router = new Router();

import {fileService} from "../services/index.js";
import File from "../models/File.js";

//маршрутизатор регистрации
router.post("/registration",
    [
        check("email", "Uncorrect email").isEmail(),
        check("password", "Password must be longer than 3 and shorter than 12").isLength({min: 3, max: 12})
    ],
    async (req,res) => {
    try { 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({message: "Uncorrect request",errors})
        }

        const {email,password} = req.body;
        
        //проверяем есть ли регистрируемый пользователь в базе данных
        const candidate = await User.findOne({email});
        if (candidate) {
            return res.status(400).json({message: `User with email ${email} already exist`})
        }

        const hashPassword = await bcrypt.hash(password, 5);
        
        //регистрируем нового пользователя
        const user = new User({email, password: hashPassword});
        await user.save();

        //создаем папку соответствующую идентификатору нового пользователя
        await fileService.createDir(new File({user: user.id, name: ""}))
        return res.json({message: "User was created"});
    } catch (e) {
        console.log(e);
        res.send({message: "Server error"})
    }
})

//маршрутизатор авторизации
router.post("/login", 
    async (req,res) => {
    try { 
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const isPassValid = bcrypt.compareSync(password,user.password);
        if (!isPassValid) {
            return res.status(400).json({message: "Invalid password"});
        }

        //создаем токен указанного пользователя, этот токен будет содержать в себе идентификатор указанного пользователя
        const token = jwt.sign({id: user.id}, process.env.secretKey,{expiresIn: "7d"});

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                userSpace: user.userSpace,
                avatar: user.avatar
            }
        })
        
    } catch (e) {
        console.log(e);
        res.send({message: "Server error"})
    }
})

export default router;