import { FastifyInstance, RouteGenericInterface } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { authMiddleware } from "../middlewares/auth-middleware";
import { EnvironmentController } from "../controllers/environment-controller";
import z from "zod";

const getEnvironmentSchema = {
    schema: {
        summary: 'Capturar os ambientes cadastrados para o usuário',
        tags: ['Ambientes'],
        response: {
            200: z.object({
                error: z.boolean(),
                message: z.string(),
                environments: z.array(
                    z.object({
                        id: z.number(),
                        userOwner: z.string(),
                        name: z.string(),
                        createdAt: z.string(),
                        active: z.boolean(),
                        permitions: z.array(z.enum(['editar', 'compartilhar', 'deletar'])).optional()
                    })
                )
            }),
            204: z.object({
                error: z.string(),
                message: z.string(),
                environments: z.array(z.object({
                    id: z.number(),
                    userOwner: z.string(),
                    name: z.string(),
                    createdAt: z.string(),
                    active: z.boolean(),
                    permitions: z.array(z.string())
                })).optional()
            }),
            401: z.any(),
            400: z.any(),
        }
    }
}

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
                    name: z.string(),
                    createdAt: z.string(),
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

const updateEnvironmentSchema = {
    schema: {
        summary: 'Atualizar um ambiente',
        tags: ['Ambientes'],
        body: z.object({
            id: z.number({ message: 'ID de ambiente é obrigatório' }),
            name: z.string({ message: 'ID de ambiente é obrigatório' }),
        }),
        response: {
            200: z.object({
                error: z.boolean(),
                message: z.string(),
                environment: z.object({
                    id: z.number(),
                    userOwner: z.string(),
                    name: z.string(),
                    createdAt: z.string(),
                    active: z.boolean(),
                })
            }),
            400: z.object({
                error: z.boolean(),
                message: z.string(),
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
}

type TUpdateEnvironment = z.infer<typeof updateEnvironmentSchema.schema.body>;
export interface IUpdateEnvironment extends RouteGenericInterface {
    Body: TUpdateEnvironment;
}

const deleteEnvironmentSchema = {
    schema: {
        summary: 'Delete lógico de um ambiente',
        tags: ['Ambientes'],
        body: z.object({
            id: z.number({ message: 'ID de ambiente é obrigatório' }),
        }),
        response: {
            200: z.object({
                error: z.boolean(),
                message: z.string(),
                environment: z.object({
                    id: z.number(),
                    userOwner: z.string(),
                    name: z.string(),
                    createdAt: z.string(),
                    active: z.boolean(),
                })
            }),
            400: z.object({
                error: z.boolean(),
                message: z.string(),
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
}

type TDeleteEnvironment = z.infer<typeof deleteEnvironmentSchema.schema.body>;
export interface IDeleteEnvironment extends RouteGenericInterface {
    Body: TDeleteEnvironment;
}

class EnvironmentRoutes {
    static async get(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .get('/environments', { preHandler: authMiddleware, schema: getEnvironmentSchema.schema }, async (req, res) => {
                await EnvironmentController.get(req, res)
            })
    }

    static async post(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .post<{ Body: TCreateEnvironment }>('/environments', { preHandler: authMiddleware, schema: createEnvironmentSchema.schema }, async (req, res) => {
                await EnvironmentController.post(req, res);
            });
    }

    static async put(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .put<{ Body: TUpdateEnvironment }>('/environments', { preHandler: authMiddleware, schema: updateEnvironmentSchema.schema }, async (req, res) => {
                await EnvironmentController.put(req, res)
            })
    }

    static async delete(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .delete<{ Body: TDeleteEnvironment }>('/environments', { preHandler: authMiddleware, schema: deleteEnvironmentSchema.schema }, async (req, res) => {
                await EnvironmentController.delete(req, res)
            })
    }
}

export { EnvironmentRoutes }