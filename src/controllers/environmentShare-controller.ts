import { FastifyReply, FastifyRequest } from "fastify";
import { IPostEnvironmentShare } from "../routes/environment-share-routes";
import { get } from "http";
import { getToken } from "../utils/get-token";
import { EnvironmentService } from "../services/environment-service";
import { UserService } from "../services/user-service";
import { EnvironmentShareService } from "../services/environmentShare-service";
import dayjs from "dayjs";

class EnvironmentShareController {
    static async post(req: FastifyRequest<IPostEnvironmentShare>, res: FastifyReply) {
        const { id, email, permitions } = req.body
        const user = getToken(req.headers.authorization)?.payload;
        const userPartner = await UserService.get(email);
        if (!userPartner) return res.status(404).send({ error: true, message: 'Usuário parceiro não encontrado' })
        if (!user) return res.status(401).send({ error: true, message: 'Usuário não autenticado' })

        // const environmentAlreadyShared = await EnvironmentShareService.get(id, userPartner.id)

        console.log(user)
        console.log(userPartner)

        const environment = await EnvironmentService.get(undefined, id)

        if (environment[0]?.userOwner === user.id) { // Se o proprietário do ambiente for quem compartilhou
            const data = {
                environment: id,
                userOwner: user.id,
                userPartner: userPartner.id,
                permitions: permitions && permitions.length > 0 ? permitions.join(',') : '',
                createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                active: true,
            }
            const share = await EnvironmentShareService.post({ ...data })
        } else { // Se um usuário que não é o proprietário compartilhou
            // TODO: Continuar aqui, quando quem compartilhou não é proprietário do ambiente.
            console.log('NÃO PERTENCE À QUEM COMPARTILHOU')
        }

        if (environment.length === 0) return res.status(404).send({ error: true, message: 'Ambiente não encontrado' })

        if (environment[0].userOwner === userPartner?.id) return res.status(409).send({ error: true, message: 'Você nao pode compartilhar seu ambiente com você mesmo' })


        return res.status(200).send({ error: false, message: 'Ambiente compartilhado com sucesso' })
    }
}

export { EnvironmentShareController }