import { prisma } from "../../lib/prisma";

export async function createEnvironmentService( id: string, name: string ) {

    name = name.toLocaleLowerCase();

    const environment = await prisma.environment.create({
        data: {
            userOwner: id,
            name
        }
    })

    return environment;
}