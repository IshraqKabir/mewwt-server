import { Ctx, Query, Resolver } from "type-graphql";
import { Recipe } from "../model/Recipe";

@Resolver(Recipe)
export class RecipeResolver {
    @Query(() => String)
    recipes(
        @Ctx() ctx: any
    ) {
        return ctx.user.name;
    }
}
