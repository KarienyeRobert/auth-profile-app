import User from "../model/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
}

const register = async (req, res) => {
    const {name,email,password,confirmPassword}=req.body;
    if (password !== confirmPassword){
        return res.status(400).json({message: "Passwords do not match"});
    }

    const userExists = await User.findOne({
        email
    })
    if (userExists){
        return res.status(400).json({message: "User already exists"});
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400).json({message: "Invalid user data"});
    }
}

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await  User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(401).json({message: "Invalid email or password"});
    }
}

const getUserProfile = async(req,res) =>{
    const user = await User.findById(req.user._id);
    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    }
}