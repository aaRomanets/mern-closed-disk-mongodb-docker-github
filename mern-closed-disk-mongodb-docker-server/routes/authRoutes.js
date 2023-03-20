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
    try 
    { 
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
        {
            return res.status(400).json({message: "Uncorrect request",errors})
        }
        
        //проверяем есть ли регистрируемый пользователь в базе данных
        User.findOne({ email: req.body.email}, (err, userExist) => 
        {
            //существующего пользователя удаляем из базы данных
            if (userExist != undefined)
            {
                User.findOneAndDelete(
                {
                    email: req.body.email
                },
                (err, doc) => {
                });
            }

            //hash the password   
            bcrypt.hash(req.body.password,10).then((hashedPassword) => 
            {
                //create a new user instance and collect the data
                const user = new User({
                    email: req.body.email,
                    password: hashedPassword
                });

                //save the new user
                user.save()
                //return success if the new user is added to the database successfully
                .then((_) => {
                    fileService.createDir(new File({user: user.id, name: ""}))
                    res.json({message: "User was created"});
                })
                //catch error if the new user wasn't added successfully to the database
                .catch((error) => {
                    res.status(500).send({
                        message: "Error creating user",
                        error
                    })
                })
            })
            //catch error if the password hash isn't successfull
            .catch((e) => {
                res.status(500).send({
                    message: "Password was not hashed successfully",
                    e
                })
            })
        })
    } 
    catch (e) 
    {
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