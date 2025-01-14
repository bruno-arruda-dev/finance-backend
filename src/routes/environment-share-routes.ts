import { FastifyInstance, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authMiddleware } from "../middlewares/auth-middleware";
import { EnvironmentShareController } from "../controllers/environmentShare-controller";
import { EnvironmentSchema } from "./environment-routes";

const getEnvironmentShareSchema = {
    schema: {
        summary: 'Obter compartilhamento de ambiente',
        tags: ['Ambientes', 'Compartilhamento de Ambientes'],
        querystring: z.object({
            id: z.string(),
        }),
        response: {
            200: z.object({
                error: z.boolean(),
                message: z.string(),
                environment: EnvironmentSchema
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
            201: EnvironmentSchema,
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
    static async get(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .get<{ Querystring: { id: string } }>('/environments/share', { preHandler: authMiddleware, schema: getEnvironmentShareSchema.schema }, async (req, res) => {
                await EnvironmentShareController.get(req, res);
            });
    }
    static async post(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .post<{ Body: TPostEnvironmentShare }>('/environments/share', { preHandler: authMiddleware, schema: createEnvironmentShareSchema.schema }, async (req, res) => {
                await EnvironmentShareController.post(req, res);
            });
    }
}

export { EnvironmentShareRoutes }