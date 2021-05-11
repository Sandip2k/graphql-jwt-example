import { Field, ObjectType } from "type-graphql";
import { User } from "../../../../models/User";

@ObjectType()
export class LoginResponse {
    @Field(() => User)
    user!: User;

    @Field()
    accessToken!: string;
}
