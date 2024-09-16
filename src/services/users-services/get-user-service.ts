import { prisma } from "../../lib/prisma";

/**
 * Essa função busca um usuário no banco de dados usando o Prisma ORM, podendo realizar a busca tanto por email quanto por id.
 * 
 * @param email - O email do usuário que será buscado. Opcional.
 *  - Tipo: `string | undefined`
 *  - Exemplo: `'user@example.com'`
 * 
 * @param id - O ID do usuário que será buscado. Opcional.
 *  - Tipo: `string | undefined`
 *  - Exemplo: `'123456789'`
 * 
 * @returns Uma `Promise` que resolve para o objeto do usuário ou `null` se nenhum usuário for encontrado.
 *  - Tipo: `Promise<User | null>`
 *  - Exemplo de retorno: `{ id: '123', email: 'user@example.com', name: 'John Doe' }`
 * 
 * @example
 * ```typescript
 * async function exampleUsage() {
 *   const email: string = 'user@example.com';  // Email a ser buscado
 *   const userByEmail = await getUser(email);  // Busca por email
 *   
 *   const id: string = '123456789';  // ID a ser buscado
 *   const userById = await getUser(undefined, id);  // Busca por ID
 *   
 *   if (userByEmail) {
 *     console.log('Usuário encontrado pelo email:', userByEmail);
 *   } else {
 *     console.log('Usuário não encontrado pelo email.');
 *   }
 * 
 *   if (userById) {
 *     console.log('Usuário encontrado pelo ID:', userById);
 *   } else {
 *     console.log('Usuário não encontrado pelo ID.');
 *   }
 * }
 * 
 * exampleUsage();
 * ```
 * 
 * @throws {Error} Caso nenhum dos parâmetros `email` ou `id` seja enviado, um erro será registrado no console.
 * 
 * @remarks
 * - A função prioriza a busca por email se ambos os parâmetros forem fornecidos.
 * - A busca por `id` só será realizada se o email não for fornecido.
 * 
 * @note
 * - A função atualmente só retorna usuários ou `null`, não lançando exceções diretamente. No entanto, um erro é logado no console se nenhum parâmetro for passado.
 * - Certifique-se de que o Prisma está configurado corretamente com o modelo `User` no seu esquema para que a função funcione.
 */

export async function getUserService(email?: string, id?: string) {
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