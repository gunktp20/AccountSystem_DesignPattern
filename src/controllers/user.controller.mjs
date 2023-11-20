
import DBConnSingleton from "../db/db_conn.mjs";
import JWTFactory from "../validation/jwt.validation.mjs";
const dbconn = DBConnSingleton.getInstance(); 

const getAllUser = async (req,res)=>{

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({msg:"Unauthorized !"})
    }
    
    const token = authHeader.split(" ")[1];

    try{
        const accessToken = await JWTFactory.verifyToken("access",token)
        const tokenValid = await accessToken.verifyToken();
        console.log(tokenValid)
        if(!tokenValid){
            return res.status(401).json({msg:"Unauthorized !"})
        }
        dbconn.conn.query("SELECT * FROM user",function(err,docs){
            return res.status(200).json(docs);
        })
    }catch(err){
        return res.status(401).json({msg:"Unauthorized !"})
    }

}

export { getAllUser} 