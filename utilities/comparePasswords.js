import bcrypt from 'bcrypt';

const compPassword=async (originalPassword,enteredPassword)=>{
    try {
        return await bcrypt.compare(enteredPassword,originalPassword);
    } catch (error) {
        console.log(`Error in comparing passwords: ${error.message}`);
    }
}

export default compPassword;