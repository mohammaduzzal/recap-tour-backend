import  httpStatus  from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from './auth.services';

const credentialsLogin = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const loginInfo = await  AuthServices.credentialsLogin(req.body)


    sendResponse(res,{
        success:true,
        statusCode : httpStatus.OK,
        message:"user login successfully",
        data : loginInfo
    })
})


export const AuthController ={
    credentialsLogin
}