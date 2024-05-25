import { ALREADYEXISTS, BADREQUEST, CREATED, FORBIDDEN, INTERNALERROR, OK, UNAUTHORIZED } from '../constants/httpStatus.js'
import { responseMessages } from '../constants/responseMessages.js'
import bcrypt, { compareSync } from "bcrypt"
import UserSchema from '../models/userModel.js'
import { GenerateToken } from '../utils/token.js'
import { v4 as uuidv4 } from 'uuid';
import { sendEmailOTP } from '../utils/sendOTP.js'
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        if (!firstName || !lastName || !email || !password) {
            return res.status(BADREQUEST).send({
                status: false,
                message: responseMessages.MISSING_FIELDS
            })
        }
        const user = await UserSchema.findOne({ email: email })
        if (user) {
            return res.status(ALREADYEXISTS).send({
                status: false,
                message: responseMessages.USER_EXISTS
            })
        } else {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            const otp = uuidv4().slice(0, 6);
            const newUser = new UserSchema({
                ...req.body,
                password: hash,
                otp: otp,
                expiresIn: Date.now() + 45000
            })
            const savedUser = await newUser.save()
            if (savedUser.errors) {
                return res.status(INTERNALERROR).send({
                    status: false,
                    message: errors.message
                })
            } else {
                savedUser.password = undefined;
                const token = GenerateToken({ data: newUser, expiresIn: '24h' });
                res.cookie('token', token, { httpOnly: true });
                await sendEmailOTP(email, otp)
                return res.status(CREATED).send({
                    status: true,
                    message: responseMessages.SUCCESS_REGISTRATION,
                    data: savedUser,
                    token: token
                })
            }
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            let user = await UserSchema.findOne({ email: email });
            if (user) {
                const isValid = compareSync(password, user.password);
                if (user.email === email && isValid) {
                    const token = GenerateToken({ data: user, expiresIn: '24h' });
                    const otp = uuidv4().slice(0, 6);
                    if (!user.isVerified) {
                        user.otp = otp,
                            user.expiresIn = Date.now() + 60000
                        await user.save()
                        await sendEmailOTP(email, otp)
                        console.log(user)
                    }
                    user.password = undefined;
                    res.cookie('token', token, { httpOnly: true });
                    res.status(OK).send({
                        status: true,
                        message: 'Login Successful',
                        token,
                        data: user,
                    });
                } else {
                    return res
                        .status(OK)
                        .send({ status: false, message: responseMessages.UN_AUTHORIZED });
                }
            } else {
                return res
                    .status(NOTFOUND)
                    .send({ status: false, message: responseMessages.NO_USER });
            }
        } else {
            return res
                .status(500)
                .send("Missing fields");
        }
    } catch (error) {
        return res.status(500)
            .send(error.message)
    }
};

export const verifyEmail = async (req, res) => {

    console.log("middleware pass hogya")
    console.log(req.user, "==>requserhai ye")
    try {
        const { otp } = req.body
        const checkOtp = await UserSchema.findOne({ otp: otp, _id: req.user.result })
        console.log(checkOtp, "==>check OTP hai ye ")
        if (checkOtp) {
            if (checkOtp.expiresIn > Date.now()) {
                checkOtp.isVerified = true
                checkOtp.otp = undefined
                checkOtp.expiresIn = undefined
                await checkOtp.save()
                res.status(OK).send({
                    status: true,
                    message: "Email Verified Successfully",
                    data: checkOtp
                })
            } else {
                res.status(UNAUTHORIZED).send({
                    status: false,
                    message: "Your OTP has been expired click the resend"
                })
            }
        } else {
            res.status(FORBIDDEN).send({
                status: false,
                message: "Wrong OTP try again"
            })
        }
    } catch (error) {
        return res.status(INTERNALERROR).send({
            status: true,
            message: error.message
        })
    }
};
export const resendotp = async (req, res) => {

    const { firstName, lastName, email, password } = req.body
    try {
        const user = await UserSchema.findOne({ email: email })
        const otp = uuidv4().slice(0, 6);
        user.otp = otp
        user.expiresIn = Date.now() + 60000
        await user.save()
        await sendEmailOTP(email, otp)
        res.status(OK).send({
            status: true,
            message: "new OTP Send to email",
            data: user
        })
    } catch (error) {
        return res.status(INTERNALERROR).send({
            status: true,
            message: error.message
        })
    }
};

