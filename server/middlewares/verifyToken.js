import jwt from 'jsonwebtoken'
export const VerifyToken = async (req , res , next) => {
    try {
        const token = req.cookies.authToken
        if(!token){
            return res.status(400).json({ message : "Unauthorized user.."})
        }
        const payload = jwt.verify(token , process.env.JWT_SECRET);
        if(!payload){
            return res.status(400).json({ message : "Unauthorized user.."})
        }
        req.user = payload.user
        next();
    } catch (error) {
        console.log("Error in verify token : " , error);
        return res.status(500).json({message : "Internal server issue"})
    }
}
