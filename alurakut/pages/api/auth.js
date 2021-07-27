import jwt from 'jsonwebtoken';
require('dotenv').config();

export default async function auth(req, res){
    if(req.method === "POST"){
        
        const { user } = req.body;

        const { message, login, id } = await fetch(`https://api.github.com/users/${user}`)
        .then((serverRes) => serverRes.json())

            if(message !== undefined){
                res.json({
                    message,
                })
            }else{
                const token = jwt.sign({ id, login }, process.env.SECRET, {
                    expiresIn: 86400,
                })

                res.json({
                    user: login,
                    token: token
                })
            }
    }else{
        res.status(404).json({
            message: "Nada no GET, mas no post tem!"
        })
    }
}