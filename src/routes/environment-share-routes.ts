import { FastifyInstance, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authMiddleware } from "../middlewares/auth-middleware";
import { EnvironmentShareController } from "../controllers/environmentShare-controller";

const createEnvironmentShareSchema = {
    schema: {
        summary: 'Criar compartilhamento de ambiente',
        tags: ['Ambientes', 'Compartilhamento de Ambientes'],
        body: z.object({
            id: z.number(),
            email: z.string().email(),
            permitions: z.array(z.enum(['editar', 'compartilhar', 'deletar'])).optional(),
        }),
        response: {
            201: z.object({
                error: z.boolean(),
                message: z.string(),
                environment: z.object({
                    id: z.number(),
                    userOwner: z.string(),
                    name: z.string(),
                    createdAt: z.string(),
                    active: z.boolean(),
                    permitions: z.array(z.enum(['editar', 'compartilhar', 'deletar'])).optional(),
                    share: z.array(
                        z.object({
                            id: z.number(),
                            createdAt: z.string(),
                            active: z.boolean(),
                            accepted: z.boolean().nullable(),
                            userOwner: z.string(),
                            userPartner: z.string(),
                            userPartnerEmail: z.string(),
                            environment: z.number(),
                        })
                    )
                }),
            }),
            401: z.object({
                error: z.boolean(),
                message: z.string(),
            }),
            404: z.object({
                error: z.boolean(),
                message: z.string(),
            }),
        }
    }
}
type TPostEnvironmentShare = z.infer<typeof createEnvironmentShareSchema.schema.body>;
export interface IPostEnvironmentShare extends RouteGenericInterface {
    Body: TPostEnvironmentShare
}

class EnvironmentShareRoutes {
    static async post(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .post<{ Body: TPostEnvironmentShare }>('/environments/share', { preHandler: authMiddleware, schema: createEnvironmentShareSchema.schema }, async (req, res) => {
                await EnvironmentShareController.post(req, res);
            });
    }
}

export { EnvironmentShareRoutes }