import { RecipeResolver } from "../../resolver/RecipeResolver";
import { UserResolver } from "../../resolver/UserResolver";

export const resolvers = [UserResolver, RecipeResolver] as const;
