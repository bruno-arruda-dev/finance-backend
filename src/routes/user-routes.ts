import { FastifyInstance, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UserController } from "../controllers/user-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const createUserSchema = {
    schema: {
        summary: 'Registrar um usuário',
        tags: ['Usuários'],
        body: z.object({
            name: z.string().nullable().optional(),
            email: z.string().email({ message: 'Email precisa ser um email válido' }),
            password: z.string({ message: 'Senha precisa ter no mínimo 8 caracteres' }).min(8, { message: 'Senha precisa ter no mínimo 8 caracteres' }),
            passwordConfirmation: z.string({ message: 'Confirmação de senha precisa ter no mínimo 8 caracteres' }).min(8, { message: 'Confirmação de senha precisa ter no mínimo 8 caracteres' }),
        })
            .refine((data) => data.password === data.passwordConfirmation, {
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
            }),
        }
    }
}
type TCreateUser = z.infer<typeof createUserSchema.schema.body>
export interface ICreateUser extends RouteGenericInterface {
    Body: TCreateUser;
}

const userLoginSchema = {
    schema: {
        summary: 'Login de usuário',
        tags: ['Usuários'],
        body: z.object({
            email: z.string({ message: 'Email precisa ser um email válido' }).email({ message: 'Email precisa ser um email válido' }),
            password: z.string({ message: 'Senha precisa ter no mínimo 8 caracteres' }).min(8, { message: 'Senha precisa ter no mínimo 8 caracteres' }),
        }),
        response: {
            201: z.object({
                error: z.boolean(),
                message: z.string(),
                user: z.object({
                    id: z.string(),
                    name: z.string().nullable(),
                    email: z.string(),
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

const getUserSchema = {
    schema: {
        summary: 'Capturar os dados do usuário',
        tags: ['Usuários'],
        response: {
            201: z.object({
                error: z.boolean(),
                message: z.string(),
                user: z.object({
                    id: z.string().uuid(),
                    name: z.string().nullable().optional(),
                    email: z.string().email(),
                    token: z.string(),
                    createdAt: z.string(),
                    active: z.boolean()
                }),
            }),
            401: z.any(),
            400: z.any(),
        }
    }
}

const putUserUpdateSchema = {
    schema: {
        summary: 'Atualizar os dados do usuário',
        tags: ['Usuários'],
        body: z.object({
            name: z.string().nullable().optional(),
            email: z.string().email({ message: 'Email precisa ser um email válido' }),
            password: z.string({ message: 'Senha precisa ter no mínimo 8 caracteres' }).min(8, { message: 'Senha precisa ter no mínimo 8 caracteres' }).nullable().optional(),
            newPassword: z.string({ message: 'Nova senha precisa ter no mínimo 8 caracteres' }).min(8, { message: 'Nova senha precisa ter no mínimo 8 caracteres' }).nullable().optional(),
            newPasswordConfirmation: z.string({ message: 'Confirmação de nova senha precisa ter no mínimo 8 caracteres' }).min(8, { message: 'Confirmação de nova senha precisa ter no mínimo 8 caracteres' }).nullable().optional(),
        }).superRefine((data, ctx) => {
            if (data.newPassword && !data.password) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "É obrigatório informar a senha atual.",
                    path: ["password"]
                });
            }
            if (data.newPassword && data.newPassword !== data.newPasswordConfirmation) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Nova senha e a confirmação da nova senha precisam ser iguais.",
                    path: ["newPasswordConfirmation"]
                });
            }
        }),
        response: {
            200: z.object({
                error: z.boolean(),
                message: z.string(),
                user: z.object({
                    id: z.string().uuid(),
                    name: z.string().nullable().optional(),
                    email: z.string().email(),
                    token: z.string(),
                    createdAt: z.string(),
                    active: z.boolean(),
                })
            }),
            401: z.any(),
            400: z.any(),

        }
    }
};
type TPutUserUpdate = z.infer<typeof putUserUpdateSchema.schema.body>;
export interface IPutUserUpdate extends RouteGenericInterface {
    Body: TPutUserUpdate;
}

class UserRoutes {
    static async getUser(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .get('/users', { preHandler: authMiddleware, schema: getUserSchema.schema }, async (req, res) => {
                await UserController.getUserController(req, res)
            });
    }

    static async createUser(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .post<{ Body: TCreateUser }>('/users', createUserSchema, async (req, res) => {
                await UserController.createUserController(req, res)
            });
    }

    static async userLogin(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .post<{ Body: TUserLogin }>('/login', userLoginSchema, async (req, res) => {
                await UserController.userLoginController(req, res)
            })
    }

    static async updateUser(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .put<{ Body: TPutUserUpdate }>('/users', { preHandler: authMiddleware, schema: putUserUpdateSchema.schema }, async (req, res) => {
                await UserController.updateUserController(req, res)
            })
    }

}

export { UserRoutes }