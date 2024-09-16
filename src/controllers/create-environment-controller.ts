import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateEnvironment } from "../routes/create-environment";
import { createEnvironmentService } from "../services/environment-services/create-environment-service";
import { getToken } from "../utils/get-token";
import { getEnvironmentService } from "../services/environment-services/get-environment-service";

export async function createEnvironmentController(req: FastifyRequest<ICreateEnvironment>, res: FastifyReply) {
    const { name, } = req.body
    const token = getToken(req.headers.authorization)
    if (!token) return res.status(401).send({error: true, message: 'Token de autorização inválido'});
    const id = token?.payload.id;

    const environments = await getEnvironmentService(id, undefined, name);

    console.log(environments)
    if (environments.length > 0) return res.status(409).send({error: true, message: "Já existe um ambiente registrado com este nome"})

    const environment = await createEnvironmentService(id, name);


    return res.status(201).send({ error: false, message: 'Ambiente cadastrado', environment });
}