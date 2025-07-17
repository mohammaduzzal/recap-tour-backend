import express, { Request,  Response }  from "express";


const app = express();

app.get("/",( req:Request, res:Response)=>{
    res.status(200).json({
        success:true,
        message:"welcome to tour recap backend project"
    })
})

export default app;