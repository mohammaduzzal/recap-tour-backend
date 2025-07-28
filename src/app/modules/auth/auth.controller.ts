import httpStatus from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from './auth.services';
import AppError from '../../errorHelpers/AppError';
import { setAuthCookie } from '../../utils/setCookie';
import { createUserToken } from '../../utils/userToken';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthServices.credentialsLogin(req.body)

    setAuthCookie(res, loginInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "user login successfully",
        data: loginInfo
    })
})



const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, " no refreshToken received")
    }


    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    setAuthCookie(res, tokenInfo)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "new access token retrieve successfully",
        data: tokenInfo
    })
})


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "user login successfully",
        data: null
    })
})


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword

    await AuthServices.resetPassword(oldPassword, newPassword,decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "password changed successfully",
        data: null
    })
})
const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   
   let redirectTo = req.query.state ? req.query.state as string : ""

   if(redirectTo.startsWith("/")){

    redirectTo = redirectTo.slice(1)
   }


    const user = req.user;

   if(!user){
    throw new AppError(httpStatus.NOT_FOUND, "user not found")
   }


   const tokenInfo =  createUserToken(user)

   setAuthCookie(res,tokenInfo)

  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})


export const AuthController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}