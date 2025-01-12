import dayjs from "dayjs";
import { prisma } from "../lib/prisma";

type TPost = {
    userOwner: string,
    userPartner: string,
    environment: number,
    permitions: string,
    active: boolean,
    createdAt: string
}

class EnvironmentShareService {
    static async get(environment?: number, userOwner?: string, userPartner?: string, active?: boolean) {
        const environmentShare = await prisma.environmentShare.findFirst({
            where: {
                active: active ? active : true,
                userOwner,
                userPartner,
                environment
            }
        })
        return environmentShare;
    }

    static async post(data: TPost) {
        const environmentShare = await prisma.environmentShare.create({
            data
        })
        return environmentShare;
    }
}

export { EnvironmentShareService }