import { prisma } from "../lib/prisma";
import { jwtGenerate } from "../utils/jwt-generate";

class UserService {
    static async getUserService(email?: string, id?: string) {
        email = email?.toLocaleLowerCase()

        if (email) {
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            return user;
        }

        if (id) {
            const user = await prisma.user.findUnique({
                where: {
                    id
                }
            })

            return user;
        }

        if (!email && !id) console.error('Nenhum parâmetro de busca de usuário foi enviado')
    }

    static async updateUserService(id: string, name?: string, email?: string, password?: string, token?: string) {
        email = email?.toLocaleLowerCase();
        name = name ? name.toLowerCase() : name;

        const user = await prisma.user.update({
            data: {
                name, email, password, token
            },
            where: {
                id
            }
        })

        return user;
    }

    static async createUserService(email: string, password: string, name: string | null,) {
        email = email?.toLocaleLowerCase();
        name = name ? name.toLowerCase() : name;

        const user = await prisma.user.create({
            data: {
                name, email, password
            }
        })

        const token = jwtGenerate({ id: user.id, name: user.name, email: user.email, password: user.password });

        const updatedUser = await UserService.updateUserService(user.id, user.name ? user.name : undefined, user.email, user.password, token)

        return updatedUser;
    }
}

export { UserService }