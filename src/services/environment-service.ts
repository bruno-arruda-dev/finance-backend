import dayjs from "dayjs";
import { prisma } from "../lib/prisma";

class EnvironmentService {
    static async get(userOwner: string, id?: number, name?: string) {
        name = name ? name.toLocaleLowerCase() : name;


        const environments = await prisma.environment.findMany({
            where: {
                userOwner,
                id,
                name,
                active: true,
            },
            include: {
                user: true,
                EnvironmentShare: {
                    where: {
                        userOwner,
                        active: true,
                        OR: [
                            { accepted: null },
                            { accepted: true }
                        ]
                    },
                    include: {
                        userPartnerRel: true
                    }
                }

            }
        })

        const environmentsSharedWithUserOwner = await prisma.environmentShare.findMany({
            where: {
                userPartner: userOwner,
                active: true,
                OR: [
                    { accepted: null },
                    { accepted: true }
                ]
            },
            include: {
                userOwnerRel: true,
                environmentRel: true,
            }
        })

        const flatEnvironments = environments.map(e => {
            return {
                "id": e.id,
                "name": e.name,
                "userOwner": e.userOwner,
                "userOwnerEmail": e.user.email,
                "userOwnerName": e.user.name,
                "createdAt": e.createdAt,
                "active": e.active,
                share: e.EnvironmentShare.map(s => {
                    return {
                        id: s.id,
                        createdAt: s.createdAt,
                        accepted: s.accepted,
                        active: s.active,
                        userPartner: s.userPartner,
                        userPartnerEmail: s.userPartnerRel.email,
                        userPartnerName: s.userPartnerRel.name,
                    }
                })

            }
        })

        const flatEnvironmentsSharedWithUserOwner = environmentsSharedWithUserOwner.map(e => {
            return {
                "id": e.environmentRel.id,
                "name": e.environmentRel.name,
                "userOwner": e.environmentRel.userOwner,
                "userOwnerEmail": e.userOwnerRel.email,
                "userOwnerName": e.userOwnerRel.name,
                "createdAt": e.environmentRel.createdAt,
                "active": e.active,
                "permitions": e.permitions,
            }
        })

        let environmentsRes = [...flatEnvironments, ...flatEnvironmentsSharedWithUserOwner].sort((a, b) => b.id - a.id)
        if (id) environmentsRes = environmentsRes.filter(e => e.id === id)
        return environmentsRes;
    }

    static async post(id: string, name: string) {
        name = name.toLocaleLowerCase().trim();
        const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')

        const environment = await prisma.environment.create({
            data: {
                userOwner: id,
                name,
                createdAt
            }
        })

        return environment;
    }

    static async put(data: { id: number, userOwner: string, name: string, createdAt: string, active: boolean }) {
        const environment = await prisma.environment.update({
            data,
            where: {
                id: data.id
            }
        })

        return environment;
    }
}

export { EnvironmentService }