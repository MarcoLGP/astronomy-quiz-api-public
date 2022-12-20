import jwt from "jsonwebtoken";

type ChangePassJWTprops = {
    id: string
}

export const ChangePassJWT = async (jwtToken: string): Promise<string | undefined> => {
    try {
        const { id } = jwt.verify(jwtToken, process.env.JWT_SECRET || "JWT_SECRET") as ChangePassJWTprops;
        return id;
    } catch (error) {
        return undefined;
    }
};