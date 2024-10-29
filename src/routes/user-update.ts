import { FastifyInstance, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { updateUserController } from "../controllers/update-user-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const userUpdateSchema = {
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
                    createdAt: z.date(),
                    active: z.boolean(),
                })
            }),
            401: z.any(),
            400: z.any(),

        }
    }
};

type TUserUpdate = z.infer<typeof userUpdateSchema.schema.body>;

export interface IUserUpdate extends RouteGenericInterface {
    Body: TUserUpdate;
}

export async function updateUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .put<{ Body: TUserUpdate }>('/users/update', { preHandler: authMiddleware, schema: userUpdateSchema.schema }, async (req, res) => {
            await updateUserController(req, res)
        })
}

export default userUpdateSchema;
