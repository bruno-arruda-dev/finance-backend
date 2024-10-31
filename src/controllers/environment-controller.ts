import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateEnvironment } from "../routes/environment-routes";
import { EnvironmentService } from "../services/environment-service";

class EnvironmentController {
    static async post(req: FastifyRequest<ICreateEnvironment>, res: FastifyReply) {
        const { name } = req.body;
        const id = req.User?.id;

        const environments = await EnvironmentService.get(id, undefined, name);

        if (environments.length > 0) return res.status(409).send({ error: true, message: "Já existe um ambiente registrado com este nome" })

        const environment = await EnvironmentService.post(id, name);


        return res.status(201).send({ error: false, message: 'Ambiente cadastrado', environment });
    }
}

export { EnvironmentController }