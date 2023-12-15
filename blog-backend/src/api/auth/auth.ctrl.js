import Joi from "joi";
import User from "../../models/user";

export const register = async (ctx) => {
    //Request Body 검증하기
    const schema = Joi.object().keys({
        username: Joi.string()
        .alphanum()
        .min(3)
        .max(20)
        .required(),
        password: Joi.string().required(),
    });
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { username, password } = ctx.request.body;
    try{
        //username이 이미 존재하는 지 확인
        const exists = await User.findByUsername(username);
        if(exists) {
            ctx.status = 409;
            return;
        }
        const user = new User({
            username,
        });
        await user.setPassword(password);
        await user.save();
        ctx.body = user.serialize();

        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, //7일
            httpOnly: true,  
        });
    } catch (e) {
        ctx.throw(500,e);
    }
};

export const login = async ctx => {
    const { username, password } = ctx.request.body;

    //없는 경우 에러처리
    if(!username || !password) {
        ctx.status = 401;
        return;
    }
    try {
        const user = await User.findByUsername(username);
        if(!user) {
            ctx.status = 401;
            return;
        }
        const valid = await user.checkPassword(password);
        if(!valid) {
            ctx.status = 401;
            return;
        }
        ctx.body = user.serialize();

        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, //7일
            httpOnly: true,  
        });
    }catch (e) {
        ctx.throw(500, e);
    }
};
export const check = async (ctx) => {
   const {user} = ctx.state;
   if(!user) {
    //로그인 중 아님
    ctx.status = 401;
    return;
   }
   ctx.body = user;
};
export const logout = async (ctx) => {
    ctx.cookies.set('access_token');
    ctx.status = 204;
};