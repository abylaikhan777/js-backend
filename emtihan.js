const express = require('express')
const app = express();

const pool = require('./db');
app.use(express.json())

app.post('/add', async(req,res)=>{
    const {name,description,quality,price} = req.body;
    try {
        const result = await pool.query('insert into product(name,description,quality,price) values($1,$2,$3,$4) ',[name,description,quality,price])
        res.json("serverga kosuldi")
    } catch (error) {
        console.log(error)
        
    }
})

app.get('/get', async(req,res)=>{
 try {
     const result = await pool.query('select * from product ')
        res.json(result.rows)
 } catch (error) {
    console.log(error);
    
 }
})

app.get('/get/:id', async(req,res)=>{
    const id = req.params.id
 try {
     const result = await pool.query('select * from product where id=$1',[id])
        res.json(result.rows)
 } catch (error) {
    console.log(error);
    
 }
})


app.put('/put/:id', async(req,res)=>{
    const id = req.params.id
     const {name,description,quality,price} = req.body;
 try {
     const result = await pool.query('update product set name=$1, description=$2, quality=$3, price=$4 where id=$5',[name,description,quality,price,id])
        res.json(result.rows)
 } catch (error) {
    console.log(error);
    
 }
})

app.delete('/delete/:id',async(req,res)=>{
     const id = req.params.id
     
 try {
     const result = await pool.query('delete from product where id=$1',[id])
        res.json(result.rows)
 } catch (error) {
    console.log(error);
    
 }
})
 
app.get('/get/products/expensive/:price', async(req, res) => {
    const price = req.params.price;
    try {
       
        const result = await pool.query('select * from product where price > $1', [price]);
        res.json(result.rows);
    } catch (error) {
        console.log(error); 
    }
});
app.listen(3000,()=>{
console.log("server is giganiga working");

})  
