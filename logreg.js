const bcrypt = require('bcrypt')
const express = require('express')
const pool = require('./db')
const app = express()
app.use(express.json())

app.post('/register',async(req,res)=>{
    const {username,password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password,10)
        const result= pool.query('insert into users(name,password) values($1,$2)',[username,hashedPassword])
        res.json(result.rows)
    } catch (error) {
        console.log(error);
        
    }
})

app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    try {
        const result=await pool.query('select * from users where name=1$',[username])
        const user = result.rows
        const chek = await bcrypt.compare(password,user.password)

        if (!chek) {
            return res.send('qate')
        }

       res.json(user)
        
    } catch (error) {
        console.log(error);
        
    }
})

app.listen(3000, ()=>{
    console.log('server is niga') 
    
}) 