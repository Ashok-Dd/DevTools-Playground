import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const Register = async (req , res) => {
    try {        
        const {username , email , password} = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const isExist = await User.findOne({email});
        if(isExist){
            return res.status(400).json({message : "Email already Exists.."})
        }
        const hashedPassword  = await bcrypt.hash(password , 10 )
        const user = await User.create({
            username , email , password : hashedPassword
        })
        const token = jwt.sign({user : user} , process.env.JWT_SECRET  , {expiresIn : '24h'})
        res.cookie("authToken" , token , {
            httpOnly : true ,
            sameSite : 'none' ,
            maxAge : 24 * 60 * 60 * 1000 ,
            secure : process.env.NODE_ENV === 'production'
        })

        return res.status(200).json({
            success : true ,
            message : "User created Sucessfully ..." , 
            user : {
                ...user._doc ,
                password : undefined
            }
        })

    } catch (error) {
        console.log("Error in register : " , error);
        return res.status(400).json({message : "Internal server issue ."})
    }
}

export const Login = async( req , res ) => {
    try {
        const { email , password } = req.body ;
        if(!email || !password ){
            return res.status(400).json({message : "All feilds are required ..."})
        }
        const user = await User.findOne({ email });
        if(!user || !user?.password){
            return res.status(400).json({message : "Email doesn't exists..!"})
        }
        const isPasswordMatched = await bcrypt.compare(password , user.password);
        if(!isPasswordMatched){
            return res.status(400).json({message : "Password Incorrect..."})
        } 
        const token = jwt.sign({user : user} , process.env.JWT_SECRET  , {expiresIn : '24h'})
        res.cookie('authToken' , token , {
            sameSite: 'none',
            httpOnly: true ,
            maxAge : 24 * 60 * 60 * 1000 ,
            secure : process.env.NODE_ENV === "production"
        })
        return res.status(200).json({
            message : "Login Sucessfull ..." ,
            success : true ,
            user : {
                ...user._doc , password : undefined
            }
        })
    } catch (error) {
        console.log("Error in Login : " , error);
        return res.status(500).json({message : 'Internal server error'})
    }
}

export const GoogleLogin = async (req, res) => {
    try {
        const { given_name, email, sub } = req.body;


        if (!email || !sub) {
        return res.status(400).json({ message: "All fields are required..." });
        }


        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({username: given_name, email, providerId: sub});
        } 
        else {
            if (sub !== user.providerId) {
                return res.status(400).json({message: "Provider mismatch!",success: false});
            }
        }

        const token = jwt.sign({ user } , process.env.JWT_SECRET , { expiresIn: "24h" });

        res.cookie("authToken", token, {
        httpOnly: true,                    
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
        message: "Login Successful",
        success: true,
        user: {
            ...user._doc,
            password: undefined
        }
        });
    } catch (error) {
        console.log("Error in GoogleLogin: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const CheckAuth = async(req , res) => {
    try {        
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(400).json({message : "Email doesn't exist ..."})
        }
        return res.status(200).json({user})
    } catch (error) {
        console.log("Error in CHek auth : " ,error);
        return res.status(400).json({error : 'Internal server error'})
    }
}

export const Logout = async(req , res) => 
{
    res.clearCookie("authToken" , {
        httpOnly: true ,
        sameSite:"none",
        secure : process.env.NODE_ENV === "production" ,
    })  
    return res.status(200).json({
        success : true ,
        message : "Logout sucessful"
    })
}