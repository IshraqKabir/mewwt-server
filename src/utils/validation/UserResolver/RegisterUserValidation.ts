import { IsEmail, Length, } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "../../../model/User";
import { FieldError } from "../FieldError";

@InputType({ description: "registering new user" })
export class RegisterUserInput implements Partial<User> {
    @Field()
    @Length(3, 254, { message: "firstName has to be atleast 3 characters long." })
    firstName: string;

    @Field()
    @Length(3, 254, { message: "lastName has to be atleast 3 characters long." })
    lastName: string;

    @Field()
    @IsEmail({}, { message: "Not An email buddy!" })
    email: string;

    @Field()
    @Length(3, 254)
    password: string;

    @Field()
    @Length(3, 254)
    confirmPassword: string;

}

@ObjectType()
export class UserRegisterResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[] | null;

    @Field(() => User, { nullable: true })
    data?: User | null;
}
