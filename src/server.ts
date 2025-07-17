/* eslint-disable no-console */
import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";


let server : Server;



// this func connecting to the db
const startServer = async()=>{
try {
        await mongoose.connect(envVars.DB_URL)

    console.log("connect to db");


   server = app.listen(envVars.PORT, ()=>{
        console.log(`server is listening on port ${envVars.PORT}`);
    })
    
} catch (error) {
    console.log(error);
    
}

}
startServer()


process.on("unhandledRejection", (err)=>{
    console.log("unhandled rejection detected....server is shutting down",err);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("uncaughtException", (err)=>{
    console.log("uncaught exception detected server shutting...down", err);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("SIGTERM", ()=>{
    console.log("sigterm signal  received server shutting...down");

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})