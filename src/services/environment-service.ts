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
            }
        })

        return environments;
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