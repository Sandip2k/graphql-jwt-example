import { User } from "./models/User";
import jwt from "jsonwebtoken";

export const createAccessToken = (user: User) => {
    return jwt.sign(
        { userId: user.id },
        process.env.JWT_ACCESS_SECRET
            ? process.env.JWT_ACCESS_SECRET
            : "somearbitrarilylongsecretthatyoushouldntcareabouttoomuch",
        {
            expiresIn: "15m",
        }
    );
};

export const createRefreshToken = (user: User) => {
    return jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET
            ? process.env.JWT_REFRESH_SECRET
            : "somearbitrarilylongsecretthatyoushouldntcareabouttoomuchorelseyoulljustwasteyourtime",
        {
            expiresIn: "7d",
        }
    );
};
