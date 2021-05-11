import { IsEmail, Length, MaxLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Role } from "../../../../models/User";
import { IsUserAlreadyExist } from "./IsUserAlreadyExist";

@InputType()
export class RegisterInput {
    @Field()
    @Length(1, 30)
    firstName!: string;

    @Field()
    @Length(1, 30)
    lastName!: string;

    @Field()
    @MaxLength(60)
    @IsEmail()
    @IsUserAlreadyExist({
        message: "User with this email already exists.",
    })
    email!: string;

    @Field()
    @Length(8)
    password!: string;

    @Field(() => Role, { nullable: true })
    role?: Role;
}
