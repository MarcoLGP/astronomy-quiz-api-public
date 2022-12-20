import jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
    interface UserJwtPayload extends jwt.JwtPayload {
        id: string;
        name: string;
        photo?: string;
        email: string;
        providerSocialSign?: string;
        password: string;
        level: number;
    }
}

type UserFromJWTprops = {
    id: string;
    name: string;
    photo?: string;
    providerSocialSign?: string;
    email: string;
    password: string;
    level: number;
}

export const userFromJWT = async (jwtToken: string): Promise<UserFromJWTprops | undefined> => {
    try {
        const { id, name, email, password, level, providerSocialSign } = <jwt.UserJwtPayload>jwt.verify(jwtToken, process.env.JWT_SECRET || "MISSING_SECRET");
        return { id, name, email, password, level, providerSocialSign };
    } catch (error) {
        return undefined;
    }
};