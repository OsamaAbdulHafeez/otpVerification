import pkg from 'jsonwebtoken';
import { NOTALLOWED, UNAUTHORIZED } from '../constants/httpStatus.js';
import { responseMessages } from '../constants/responseMessages.js';

const {sign,verify} = pkg

export const GenerateToken = ({ data, expiresIn }) => {
    return sign({ result: data._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: expiresIn,
    });
};


export const VerifyToken = (req, res, next) => {
    const token1 = req.headers.token;
    console.log(req.headers)
    const token = token1 && token1.split(" ")[1]
    if (!token1) {
        console.log("token nahi mila")
        return res.status(NOTALLOWED).send({
            status: false,
            message: responseMessages.NOT_A_TOKEN
        })
    }
    verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(UNAUTHORIZED).send({
                status: false,
                message: responseMessages.TOKEN_INVALID
            })
        }
        req.user = user
        console.log(req.user,'==>req.user hai ye')
        next()
    })
}