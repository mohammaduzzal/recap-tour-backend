/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken } from '../../utils/userToken';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';








const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)



    return {
        accessToken: newAccessToken
    }


}


const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)


    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "old password does not matched")
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPTJS_SALT_ROUND))

    await user!.save()

    

}


export const AuthServices = {
    getNewAccessToken,
    resetPassword
}