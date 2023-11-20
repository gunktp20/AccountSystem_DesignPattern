import jwt from 'jsonwebtoken'

export default class RefreshToken {

    constructor(token) {
        this.token = token
    }
    
    async verifyToken(){
        try{
            const payload = await jwt.verify(this.token,process.env.JWT_SECRET_REFRESH)
            this.payload = payload
            this.isTokenValid = true;
            return true;
        }catch(err){
            console.log(err)
            return false;
        }
    }

    getPayload(){
        if(!this.isTokenValid || this.isTokenValid === false){
            return;
        }
        return this.payload;
    }

}