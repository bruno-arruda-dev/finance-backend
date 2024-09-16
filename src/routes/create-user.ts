import { FastifyInstance, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createUserController } from "../controllers/create-user-controller";

const createUserSchema = {
    schema: {
        body: z.object({
            name: z.string().nullable().optional(),
            email: z.string().email({message: 'Email precisa ser um email válido'}),
            password: z.string({message: 'Senha precisa ter no mínimo 8 caracteres'}).min(8, {message: 'Senha precisa ter no mínimo 8 caracteres'}),
            passwordConfirmation: z.string().min(8),
        }).refine((data) => data.password === data.passwordConfirmation, {
            message: "Senha e confirmação de senha são diferentes",
            path: ["passwordConfirmation"],
        }),
        response: {
            201: z.object({
                error: z.boolean(),
                message: z.string(),
                user: z.object({
                    id: z.string().uuid(),
                    name: z.string().nullable().optional(),
                    email: z.string().email(),
                    token: z.string(),
                }),
            })
        }
    }
}

type TCreateUser = z.infer<typeof createUserSchema.schema.body>

export interface ICreateUser extends RouteGenericInterface {
    Body: TCreateUser;
}

export async function createUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post<{ Body: TCreateUser }>('/users', createUserSchema, async (req, res) => {
            await createUserController(req, res)
        });
}
