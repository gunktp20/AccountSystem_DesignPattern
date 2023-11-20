
import DBConnSingleton from "../db/db_conn.mjs";
import jwt from 'jsonwebtoken'
import JWTFactory from "../validation/jwt.validation.mjs";
const dbconn = DBConnSingleton.getInstance();

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "Please provide all value!" })
    }
    
    dbconn.conn.query('SELECT * FROM `user`',[],
            async function (err, docs) {

            let user = await docs.filter((item)=>{
                return item.username === username;
            })

            user = user[0];
            
            if(!user){
                return res.status(400).json({msg:"Not found your account!"})
            }

            const isPasswordCorrect = user.password === password ? true : false

            if (!isPasswordCorrect) {
                return res.status(400).json({ msg: "Password is not correct!" });
            }

            const accessToken = await jwt.sign({ username: user.username }, process.env.JWT_SECRET_ACCESS, { expiresIn: '1m' })
            const refreshToken = await jwt.sign({ username: user.username }, process.env.JWT_SECRET_REFRESH, { expiresIn: '1h' })

            return res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                },
                accessToken: accessToken,
                refreshToken:refreshToken
            })
        })
}

const register = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "Please provide all value!" })
    }

    dbconn.conn.query('SELECT * FROM `user`',[],
            async function (err, docs) {

            let user = await docs.filter((item)=>{
                return item.username === username;
            })

            user = user[0];
            
            if(user){
                return res.status(400).json({msg:"Username is already exists !"})
            }

            dbconn.conn.query('INSERT INTO user (username, password) VALUES (?,?)', [req.body.username, req.body.password],async function(error, 
                results){
                    
                   if (error) return res.json({ error: error });
            
                   return res.status(200).json({msg:"created your account!"});})
        })

   
}

const refresh = async (req,res)=>{

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({msg:"Unauthorized !"})
    }
    
    const token = authHeader.split(" ")[1];

    try{
        const refreshTokenInstance = await JWTFactory.verifyToken("refresh",token)
        const tokenValid = await refreshTokenInstance.verifyToken();
        if(!tokenValid){
            return res.status(401).json({msg:"Unauthorized !"})
        }
        const payload = await refreshTokenInstance.getPayload();
        console.log(payload)
        dbconn.conn.query('SELECT * FROM `user`',[],
            async function (err, docs) {

                let user = await docs.filter((item)=>{
                    return item.username === payload.username;
                })
    
                user = user[0];
                
                if(!user){
                    return res.status(400).json({msg:"Not found your account!"})
                }

                const accessToken = await jwt.sign({ username: user.username }, process.env.JWT_SECRET_ACCESS, { expiresIn: '1m' })
                const refreshToken = await jwt.sign({ username: user.username }, process.env.JWT_SECRET_REFRESH, { expiresIn: '1h' })
                
                return res.status(200).json({
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    },
                    accessToken: accessToken,
                    refreshToken:refreshToken
                })
            })
       

    }catch(err){
        return res.status(401).json({msg:"Unauthorized !"})
    }

}

export { login, register , refresh } 