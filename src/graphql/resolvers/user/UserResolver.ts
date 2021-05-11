import { isAdmin } from "./../../../middleware/isAdmin";
import { isAuth } from "./../../../middleware/isAuth";
import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { Role, User } from "../../../models/User";
import bcrypt from "bcryptjs";
import { RegisterInput } from "./register/RegisterInput";
import { LoginResponse } from "./login/LoginResponse";
import { MyContext } from "../../../types/MyContext";
import { createAccessToken, createRefreshToken } from "../../../auth";
import { client } from "../../../redis";

@Resolver(User)
export class UserResolver {
    @Query(() => String)
    async hello(): Promise<string> {
        return "Hello World";
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    async bye(): Promise<string> {
        return "bye";
    }

    @Query(() => String)
    @UseMiddleware([isAuth, isAdmin])
    async byeAdmin(): Promise<string> {
        return "bye Admin";
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return User.find();
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: MyContext
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("Invalid username or password");
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new Error("Invalid username or password");
        }

        // login successful, return JWT

        const refreshToken = createRefreshToken(user);

        let noError = false;

        try {
            const result = await client.set(
                user.id.toString(),
                refreshToken.toString(),
                "EX",
                24 * 7 * 60 * 60
            );
            if (result === "OK") {
                noError = true;
            }
        } catch (error) {
            console.log(error);
            throw new Error("Internal Server error.");
        }

        if (noError) {
            res.cookie("jid", refreshToken, {
                httpOnly: true,
                path: "/refresh-token",
            });

            return {
                user,
                accessToken: createAccessToken(user),
            };
        } else {
            throw new Error("Internal Server Error");
        }
    }

    @Mutation(() => Boolean)
    async register(
        @Arg("input")
        { firstName, lastName, email, password, role }: RegisterInput
    ): Promise<Boolean> {
        try {
            const hashedPassword = await bcrypt.hash(password, 12);

            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            }).save();

            if (role) {
                user.role = role;
                user.save();
            }

            return true;
        } catch (error) {
            return false;
        }
    }
}
