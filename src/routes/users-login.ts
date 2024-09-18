import { FastifyInstance, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { userLoginController } from "../controllers/user-login-controller";

const userLoginSchema = {
    schema: {
        summary: 'Login de usuário',
        tags: ['Usuários'],
        body: z.object({
            email: z.string().email({message: 'Email precisa ser um email válido'}),
            password: z.string({message: 'Senha precisa ter no mínimo 8 caracteres'}).min(8, {message: 'Senha precisa ter no mínimo 8 caracteres'}),
        }),
        response: {
            200: z.object({
                error: z.boolean(),
                message: z.string(),
            }),
            201: z.object({
                error: z.boolean(),
                message: z.string(),
                user: z.object({
                    token: z.string(),
                })
            })
        }
    }
}

type TUserLogin = z.infer<typeof userLoginSchema.schema.body>;

export interface IUserLogin extends RouteGenericInterface {
    Body: TUserLogin;
}

export async function userLogin(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .post<{Body: TUserLogin}>('/login', userLoginSchema, async (req, res) => {
        await userLoginController(req, res)
    })
}