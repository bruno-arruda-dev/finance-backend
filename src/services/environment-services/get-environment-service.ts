
import { prisma } from "../../lib/prisma";

export async function getEnvironmentService(userOwner: string, id?: number, name?: string) {
    
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