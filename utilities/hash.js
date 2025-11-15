import bcrypt from 'bcrypt';

export const hashPassword=async (user)=>{
    try {
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(user.password,salt);
        user.confirmPassword=undefined;
    } catch (error) {
        console.log(`Error in hashing the password: ${error.message}`);
    }
}