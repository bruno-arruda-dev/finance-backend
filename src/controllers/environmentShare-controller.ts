import dayjs from "dayjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { TEnvironment } from "../routes/environment-routes";
import { IPostEnvironmentShare } from "../routes/environment-share-routes";
import { EnvironmentService } from "../services/environment-service";
import { EnvironmentShareService } from "../services/environmentShare-service";
import { UserService } from "../services/user-service";
import { getToken } from "../utils/get-token";
import { permitionsArrayToString, permitionsStringToArray } from "../utils/permitions-handler";

type TParams = {
    id?: string,
}

class EnvironmentShareController {
    static async get(req: FastifyRequest<{ Querystring: TParams }>, res: FastifyReply) {
        const user = getToken(req.headers.authorization);
        const { id } = req.query
        const environment: any = await EnvironmentService.get(undefined, Number(id))
        if (environment.length === 0) return res.status(404).send({ error: true, message: 'Ambiente não encontrado' })
        if (!user) return res.status(400).send({ error: true, message: 'Usuário não encontrado' });
        if (user.payload.id === environment[0].userOwner) {

            return res.status(200).send({
                error: false,
                message: 'Compartilhamentos do ambiente',
                environment: { permitions: ["editar", "compartilhar", "deletar"], ...environment[0] }
            })
        } else {
            const validShare = environment[0].share.filter((share: any) => share.userPartner === user.payload.id)
            if (validShare.length === 0) return res.status(404).send({ error: true, message: 'Compartilhamento não encontrado' })

            const share = validShare[0].permitions.includes("compartilhar") ? environment[0].share.filter((share: any) => share.userPartner !== user.payload.id)
                : []

            return res.status(200).send({
                error: false,
                message: 'Compartilhamentos do ambiente',
                environment: {
                    ...environment[0],
                    permitions: validShare[0].permitions,
                    share,
                }
            })
        }
    }

    static async post(req: FastifyRequest<IPostEnvironmentShare>, res: FastifyReply) {
        const { id, email, permitions } = req.body
        const user = getToken(req.headers.authorization)?.payload;
        const userPartner = await UserService.get(email);
        if (!userPartner) return res.status(404).send({ error: true, message: 'Usuário parceiro não encontrado' })
        if (!user) return res.status(401).send({ error: true, message: 'Usuário não autenticado' })
        const environmentAlreadyShared = await EnvironmentShareService.get(id, undefined, userPartner.id)
        if (environmentAlreadyShared) return res.status(409).send({ error: true, message: 'Já existe um compartilhamento ativo deste ambiente com este usuário' })
        const environment = await EnvironmentService.get(undefined, id)
        if (!environment) return res.status(404).send({ error: true, message: 'Ambiente não encontrado' })

        let environmentSuccessReply: TEnvironment = {
            id: environment[0].id,
            userOwner: environment[0].userOwner,
            userOwnerEmail: environment[0].userOwnerEmail,
            userOwnerName: environment[0].userOwnerName,
            name: environment[0].name,
            createdAt: environment[0].createdAt,
            active: environment[0].active,
            permitions: [''],
            share: []
        }

        const data = {
            environment: id,
            userOwner: user.id,
            userPartner: userPartner.id,
            permitions: permitions && permitions.length > 0 ? permitionsArrayToString(permitions) : '',
            createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            active: true,
        }

        if (environment[0]?.userOwner === user.id) {
            const share = await EnvironmentShareService.post({ ...data })

            environmentSuccessReply.share = [{
                id: share.id,
                createdAt: share.createdAt,
                active: share.active,
                accepted: share.accepted,
                userPartner: share.userPartner,
                userPartnerEmail: userPartner.email,
                userPartnerName: userPartner.name,
                permitions: permitionsStringToArray(share.permitions)
            }]

            environmentSuccessReply.permitions = permitionsStringToArray(share.permitions)

        } else {
            const userHavePermition = await EnvironmentShareService.get(id, undefined, user.id)
            if (!userHavePermition) return res.status(401).send({ error: true, message: 'Você não tem permissão para compartilhar este ambiente' })
            const savedPermitions = userHavePermition.permitions;
            if (!savedPermitions.includes('compartilhar')) return res.status(401).send({ error: true, message: ' Vocé nao tem permissão para compartilhar este ambiente' })
            const sharingPermitions = permitionsStringToArray(data.permitions)
            const sharePermitionsOnlyIfHavePermition = sharingPermitions.filter(permition => savedPermitions.includes(permition))
            console.log(sharePermitionsOnlyIfHavePermition)

            const share = await EnvironmentShareService.post({ ...data, permitions: permitionsArrayToString(sharePermitionsOnlyIfHavePermition) })

            environmentSuccessReply.share = [{
                id: share.id,
                createdAt: share.createdAt,
                active: share.active,
                accepted: share.accepted,
                userPartner: share.userPartner,
                userPartnerEmail: userPartner.email,
                userPartnerName: userPartner.name,
                permitions: permitionsStringToArray(share.permitions)
            }]

            environmentSuccessReply.permitions = permitionsStringToArray(share.permitions)
        }

        if (environment.length === 0) return res.status(404).send({ error: true, message: 'Ambiente não encontrado' })

        if (environment[0].userOwner === userPartner?.id) return res.status(409).send({ error: true, message: 'Você nao pode compartilhar seu ambiente com você mesmo' })


        return res.status(200).send({ error: false, message: 'Ambiente compartilhado com sucesso', environment: environmentSuccessReply })
    }
}

export { EnvironmentShareController };
