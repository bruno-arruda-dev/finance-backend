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
            }
        })

        return environments;
    }

    static async post(id: string, name: string) {
        name = name.toLocaleLowerCase();
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
}

export { EnvironmentService }