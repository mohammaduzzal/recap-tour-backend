import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from '../utils/jwt';
import { envVars } from '../config/env';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import { IsActive } from '../modules/user/user.interface';

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const accessToken = req.headers.authorization
        if (!accessToken) {
            throw new AppError(httpStatus.BAD_REQUEST, "no token received")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "user does not exit")
        }


        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `user is ${isUserExist.isActive}`)
        }

        if (isUserExist.isDelete) {
            throw new AppError(httpStatus.BAD_REQUEST, "user is deleted")
        }


        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.BAD_REQUEST, "you are not permitted to view this route")
        }

        req.user = verifiedToken

        next()

    } catch (error) {
        next(error)

    }
}