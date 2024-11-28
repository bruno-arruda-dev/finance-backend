import z from "zod";

const createEnvironmentShareSchema = {
    schema: {
        summary: 'Criar compartilhamento de ambiente',
        tags: ['Ambientes', 'Compartilhamento de Ambientes'],
        body: z.object({
            email: z.string()
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
            })
        }
    }
}