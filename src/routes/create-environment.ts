import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

const createEnvironmentSchema = {
    schema: {
        body: z.object({
            name: z.string().min(4),
        }),
        params: z.object({
            user: z.string().uuid()
        }),
        response: {
            201: z.object({
                id: z.number(),
                name: z.string(),
                userOwner: z.string().uuid(),
                // createdAt: z.date(),
                active: z.boolean()
            })
        }
    }
}

export async function createEnvironment(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/environments/:user', createEnvironmentSchema, async (req, res) => {

        const { user } = req.params;
        const { name } = req.body

        res.status(201).send({id: 1, name: 'Bruno Arruda', userOwner: '5ca65eed-e07a-4502-aabf-fbf132a0294a', active: true})

    })
}

// const createuserSchema = {
//     schema: {
//         body: z.object({
//             name: z.string().min(4).nullable(),
//             email: z.string().email(),
//             password: z.string().min(8),
//             passwordConfirmation: z.string().min(8),
//         }),
//         response: {
//             201: z.object({
//                 id: z.string().uuid(),
//                 name: z.string().min(4).nullable(),
//                 email: z.string().email(),
//                 token: z.string()
//             })
//         }
//     }
// }

// export async function createUser(app: FastifyInstance) {
//     app
//         .withTypeProvider<ZodTypeProvider>()
//         .post('/users', createuserSchema, async (req, res) => {
//             const { name, email, password, passwordConfirmation } = req.body;

//             return res.status(201).send({ id: '5ca65eed-e07a-4502-aabf-fbf132a0294a', name: 'Bruno', email: "bruno.arrm@gmail.com", token: 'asd' })
//         });
// }