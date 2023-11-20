import DBConnSingleton from "../db/db_conn.mjs";
import JWTFactory from "../validation/jwt.validation.mjs";
const dbconn = DBConnSingleton.getInstance(); 

const verifyAdmin = async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({msg:"Unauthorized !"})
    }
    
    const token = authHeader.split(" ")[1];
    
    try{
        const accessTokenInstance = await JWTFactory.verifyToken("access",token)
        const tokenValid = await accessTokenInstance.verifyToken();

        if(!tokenValid){
            return res.status(401).json({msg:"Unauthorized !"})
        }
        const payload = await accessTokenInstance.getPayload();

        dbconn.conn.query('SELECT * FROM `user`',[],
            async function (err, docs) {

            let user = await docs.filter((item)=>{
                return item.username === payload.username;
            })

            user = user[0];
            
            if(!user){
                return res.status(400).json({msg:"Not found your account!"})
            }

            if(user.role !== "admin"){
                return res.status(400).json({msg:"require admin role !"})
            }

            next();
        })

    }catch(err){
        console.log(err)
        return res.status(401).json({msg:"Unauthorized !"})
    }
}

export default verifyAdmin