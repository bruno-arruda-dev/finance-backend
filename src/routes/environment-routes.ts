import { FastifyInstance, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { authMiddleware } from "../middlewares/auth-middleware";
import { EnvironmentController } from "../controllers/environment-controller";
import z from "zod";

const createEnvironmentSchema = {
    schema: {
        summary: 'Registrar um ambiente',
        tags: ['Ambientes'],
        body: z.object({
            name: z.string().min(4),
        }),
        user: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            password: z.string(),
        }),
        response: {
            201: z.object({
                error: z.boolean(),
                message: z.string(),
                environment: z.object({
                    id: z.number(),
                    userOwner: z.string(),
                    name: z.string().nullable(),
                    createdAt: z.date(),
                    active: z.boolean(),
                })
            }),
            401: z.object({
                error: z.boolean(),
                message: z.string(),
            }),
            409: z.object({
                error: z.boolean(),
                message: z.string(),
            }),
        }
    }
};

type TCreateEnvironment = z.infer<typeof createEnvironmentSchema.schema.body>;

export interface ICreateEnvironment extends RouteGenericInterface {
    Body: TCreateEnvironment;
}

class EnvironmentRoutes {
    static async post(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .post<{ Body: TCreateEnvironment }>('/environments', { preHandler: authMiddleware, schema: createEnvironmentSchema.schema }, async (req, res) => {
                await EnvironmentController.post(req, res);
            });
    }
}

export { EnvironmentRoutes }