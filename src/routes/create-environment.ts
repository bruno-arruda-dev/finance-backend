import { FastifyInstance, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createEnvironmentController } from "../controllers/create-environment-controller";

const createEnvironmentSchema = {
    schema: {
        summary: 'Registrar um ambiente',
        tags: ['Ambientes'],
        body: z.object({
            name: z.string().min(4),
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

export async function createEnvironment(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post<{ Body: TCreateEnvironment }>('/environments', createEnvironmentSchema, async (req, res) => {
            await createEnvironmentController(req, res);
        });
}
