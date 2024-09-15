import { prisma } from "../../lib/prisma";

export async function createUserService(name: string, email: string, password: string, token: string) {

    const user = await prisma.user.create({
        data: {
            name, email, password, token
        }
    })

    return user;
}