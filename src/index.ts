import jwt from "jsonwebtoken";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { User } from "./models/User";
import path from "path";
import { UserResolver } from "./graphql/resolvers/user/UserResolver";
import { createAccessToken, createRefreshToken } from "./auth";
import { client } from "./redis";

dotenv.config({ path: __dirname + "/.env" });

const main = async () => {
    try {
        await createConnection();

        const schema = await buildSchema({
            resolvers: [UserResolver],
            emitSchemaFile: path.resolve(__dirname, "graphql/schema.gql"),
        });

        const apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }) => ({ req, res }),
        });

        const app = Express();

        app.use(cookieParser());

        app.post("/refresh-token", async (req, res) => {
            const token = req.cookies.jid;

            // console.log(token);

            if (!token) {
                return res.send({ ok: false, accessToken: "" });
            }

            let payload: any = null;
            try {
                if (process.env.JWT_REFRESH_SECRET) {
                    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
                }
            } catch (error) {
                console.log(error);
                return res.send({ ok: false, accessToken: "" });
            }

            // console.log(payload.userId);

            const user = await User.findOne(payload.userId);

            if (!user) {
                return res.send({ ok: false, accessToken: "" });
            }

            const newRefreshToken = createRefreshToken(user);

            try {
                const getToken = await client.get(user.id.toString());
                if (token === getToken) {
                    const setToken = await client.set(
                        user.id.toString(),
                        newRefreshToken.toString(),
                        "EX",
                        24 * 7 * 60 * 60
                    );

                    // console.table([token, getToken, newRefreshToken]);

                    if (setToken === "OK") {
                        res.cookie("jid", newRefreshToken, {
                            httpOnly: true,
                            path: "/refresh-token",
                        });

                        return res.send({
                            ok: true,
                            accessToken: createAccessToken(user),
                        });
                    } else {
                        return res.send({ ok: false, accessToken: "" });
                    }
                }
            } catch (error) {
                console.log(error);
                return res.send({ ok: false, accessToken: "" });
            }

            return res.send({ ok: false, accessToken: "" });
        });

        app.use(
            cors({
                credentials: true,
                origin: "http://localhost:3000",
            })
        );

        apolloServer.applyMiddleware({ app });

        app.listen(4000, () => {
            console.log(
                `Server started on http://localhost:4000${apolloServer.graphqlPath}`
            );
        });
    } catch (error) {
        console.log(error);
    }
};

main();
