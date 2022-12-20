import jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
    interface SocialSignJwtPayload extends jwt.JwtPayload {
        email: string;
        name: string;
        provider: string;
    }
}

type SocialSignJWTprops = {
    email: string;
    name: string;
    provider: string;
}

export const SocialSignJWT = async (jwtToken: string): Promise<SocialSignJWTprops | undefined> => {
    try {
        const { email, provider, name } = <jwt.SocialSignJwtPayload>jwt.decode(jwtToken);
        return { email, provider, name };
    } catch (error) {
        return undefined;
    }
};