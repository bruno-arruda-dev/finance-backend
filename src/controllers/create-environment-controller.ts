import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateEnvironment } from "../routes/create-environment";
import { createEnvironmentService } from "../services/environment-services/create-environment-service";
import { getEnvironmentService } from "../services/environment-services/get-environment-service";

export async function createEnvironmentController(req: FastifyRequest<ICreateEnvironment>, res: FastifyReply) {
    const { name } = req.body;
    const id = req.User?.id;

    const environments = await getEnvironmentService(id, undefined, name);

    if (environments.length > 0) return res.status(409).send({ error: true, message: "Já existe um ambiente registrado com este nome" })

    const environment = await createEnvironmentService(id, name);


    return res.status(201).send({ error: false, message: 'Ambiente cadastrado', environment });
}