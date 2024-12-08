import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateEnvironment, IDeleteEnvironment, IUpdateEnvironment } from "../routes/environment-routes";
import { EnvironmentService } from "../services/environment-service";
import { getToken } from "../utils/get-token";

type TParams = {
    id?: string,
}

class EnvironmentController {
    static async get(req: FastifyRequest<{ Querystring: TParams }>, res: FastifyReply) {
        const tempUser = getToken(req.headers.authorization);
        const { id } = req.query;
        if (!tempUser) return res.status(400).send({ error: true, message: 'Usuário não encontrado' });

        const environments = await EnvironmentService.get(tempUser.payload.id, id ? Number(id) : undefined);

        if (environments.length === 0) return res.status(204).send({ error: false, message: 'Não foram encontrados ambientes ativos para o usuário', environments: [] });

        const environmentWithPermitions = environments.map((e: any) => ({ ...e, permitions: ['editar', 'compartilhar', 'deletar'] }));
        return res.status(200).send({ error: false, message: 'Foram encontrados ambientes para o usuário', environments: environmentWithPermitions });
    }


    static async post(req: FastifyRequest<ICreateEnvironment>, res: FastifyReply) {
        const { name } = req.body;
        const id = req.User?.id;

        const environments = await EnvironmentService.get(id, undefined, name);

        if (environments.length > 0) return res.status(409).send({ error: true, message: "Já existe um ambiente registrado com este nome" })

        const environment = await EnvironmentService.post(id, name);

        return res.status(201).send({ error: false, message: 'Ambiente cadastrado', environment });
    }

    static async put(req: FastifyRequest<IUpdateEnvironment>, res: FastifyReply) {
        const environmentId = req.body.id;
        const newEnvironmentName = req.body.name.toLowerCase().trim();
        if (!environmentId || !newEnvironmentName) return res.status(400).send({ error: true, message: 'Id ou nome de ambiente não foi enviado' });

        const user = getToken(req.headers.authorization);
        if (!user) return res.status(400).send({ error: true, message: 'Usuário não encontrado' });

        const environments = await EnvironmentService.get(user!.payload.id);
        const userEnvironment: any = environments.filter((e: any) => e.id === environmentId);
        if (environments.length === 0 || !userEnvironment[0]) return res.status(404).send({ error: true, message: 'Ambiente não encontrado' });
        if (environments.some((e: any) => e.name === newEnvironmentName)) return res.status(409).send({ error: true, message: 'Já existe um ambiente registrado com este nome' })

        const newEnvironment = {
            id: userEnvironment[0].id,
            name: newEnvironmentName,
            userOwner: userEnvironment[0].userOwner,
            createdAt: userEnvironment[0].createdAt,
            active: true
        }

        const updatedEnvironment = await EnvironmentService.put(newEnvironment);

        return res.status(200).send({ error: false, message: 'Ambiente atualizado', environment: updatedEnvironment });
    }

    static async delete(req: FastifyRequest<IDeleteEnvironment>, res: FastifyReply) {
        const environmentId = req.body.id;
        if (!environmentId) return res.status(400).send({ error: true, message: 'Id ou nome de ambiente não foi enviado' });

        const user = getToken(req.headers.authorization);
        if (!user) return res.status(400).send({ error: true, message: 'Usuário não encontrado' });

        const environments = await EnvironmentService.get(user!.payload.id);
        const userEnvironment: any = environments.filter((e: any) => e.id === environmentId);
        if (environments.length === 0 || !userEnvironment[0]) return res.status(404).send({ error: true, message: 'Ambiente não encontrado' });
        const newEnvironment = {
            id: userEnvironment[0].id,
            name: userEnvironment[0].name,
            userOwner: userEnvironment[0].userOwner,
            createdAt: userEnvironment[0].createdAt,
            active: false
        }

        const updatedEnvironment = await EnvironmentService.put(newEnvironment);
        return res.status(200).send({ error: false, message: 'Ambiente atualizado', environment: updatedEnvironment });
    }
}

export { EnvironmentController }