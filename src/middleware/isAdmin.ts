import { ForbiddenError } from "apollo-server-express";
import { MiddlewareFn } from "type-graphql";
import { Role, User } from "../models/User";
import { MyContext } from "../types/MyContext";

export const isAdmin: MiddlewareFn<MyContext> = async ({ context }, next) => {
    const payload: any = context.payload;

    if (!payload) {
        return new ForbiddenError(
            "Access denied! You don't have permission for this action!"
        );
    }
    const user = await User.findOne(payload.userId);

    if (!user) {
        return new ForbiddenError(
            "Access denied! You don't have permission for this action!"
        );
    }

    if (user.role !== Role.ADMIN) {
        return new ForbiddenError(
            "Access denied! You don't have permission for this action!"
        );
    }

    return next();
};
