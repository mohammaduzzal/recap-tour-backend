/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
     const user = await UserServices.createUser(req.body)

      
        
        sendResponse(res,{
            success:true,
            statusCode:httpStatus.CREATED,
            message: "user created successfully",
            data:user
        })
})

const getAllUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
     const result = await UserServices.getAllUser()

         sendResponse(res,{
            success:true,
            statusCode:httpStatus.CREATED,
            message: "all user retrieve successfully",
            meta:result.meta,
            data:result.data
        })
})
   




export const UserController={
    createUser,
    getAllUser
}