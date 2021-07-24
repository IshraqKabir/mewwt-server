import { IsEmail, Length, } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "../../../model/User";
import { FieldError } from "../FieldError";

@InputType({ description: "registering new user" })
export class UserLoginInput implements Partial<User> {
    @Field()
    @IsEmail({}, { message: "Not An email buddy!" })
    email: string;

    @Field()
    password: string;
}

@ObjectType()
export class UserLoginResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[] | null;

    @Field(() => User, { nullable: true })
    data?: User | null;
}