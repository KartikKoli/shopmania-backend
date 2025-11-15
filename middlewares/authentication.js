import jwt from 'jsonwebtoken'
import User from '../models/User.js';

const verifyUser = async (req,res,next)=>{
    try {
        const token = req.cookies[process.env.ACCESS_TOKEN];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user= await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        console.log(`Error while authenticating: ${error.message}`);
        res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

export default verifyUser;