import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

const getHealthSchema = {
    schema: {
        summary: 'Verificar a integridade da API',
        tags: ['Integridade da API'],
        response: {
            200: z.any()
        }
    }
}

class HealthRoutes {
    static async get(app: FastifyInstance) {
        app
            .withTypeProvider<ZodTypeProvider>()
            .get('/health', getHealthSchema, async (req, res) => {
                return res.status(200).send({ error: false, message: 'API rodando...' })
            })
    }
}

export { HealthRoutes }