import { Field, ID, ObjectType, registerEnumType, Root } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Role {
    USER = "user",
    ADMIN = "admin",
}

registerEnumType(Role, {
    name: "Role",
});

@ObjectType()
@Entity({ name: "users" })
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    firstName!: string;

    @Field()
    @Column()
    lastName!: string;

    @Field()
    @Column("text", { unique: true })
    email!: string;

    @Field()
    name(@Root() parent: User): string {
        const { firstName, lastName } = parent;
        return firstName + " " + lastName;
    }

    @Column()
    password!: string;

    @Field(() => Role!)
    @Column({
        type: "enum",
        enum: Role,
        default: Role.USER,
    })
    role?: Role;
}
