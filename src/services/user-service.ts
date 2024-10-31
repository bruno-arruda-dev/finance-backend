import dayjs from "dayjs";
import { prisma } from "../lib/prisma";
import { jwtGenerate } from "../utils/jwt-generate";

class UserService {
    static async get(email?: string, id?: string) {
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

    static async put(id: string, name?: string | null, email?: string, password?: string, token?: string) {
        email = email?.toLocaleLowerCase();
        name = name ? name.toLowerCase() : name;

        const user = await prisma.user.update({
            data: {
                name: name ? name : null, email, password, token
            },
            where: {
                id
            }
        })

        return user;
    }

    static async post(email: string, password: string, name: string | null,) {
        email = email?.toLocaleLowerCase();
        name = name ? name.toLowerCase() : name;
        const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')

        console.log(createdAt)

        const user = await prisma.user.create({
            data: {
                name, email, password, createdAt
            }
        })

        const token = jwtGenerate({ id: user.id, name: user.name, email: user.email, password: user.password });

        const updatedUser = await UserService.put(user.id, user.name ? user.name : undefined, user.email, user.password, token)

        return updatedUser;
    }
}

export { UserService }