import { prisma } from "../../lib/prisma";
import { jwtGenerate } from "../../utils/jwt-generate";
import { updateUserService } from "./update-user-service";

/**
 * Cria um novo usuário no banco de dados utilizando o Prisma ORM.
 * 
 * @param name - O nome do usuário.
 *  - Tipo: `string`
 *  - Exemplo: `'John Doe'`
 * 
 * @param email - O email do usuário.
 *  - Tipo: `string`
 *  - Exemplo: `'user@example.com'`
 * 
 * @param password - A senha do usuário.
 *  - Tipo: `string`
 *  - Exemplo: `'securePassword123'`
 * 
 * @param token - O token associado ao usuário (pode ser usado para verificação, autenticação, etc.).
 *  - Tipo: `string`
 *  - Exemplo: `'verificationToken123'`
 * 
 * @returns Uma `Promise` que resolve para o objeto do usuário recém-criado.
 *  - Tipo: `Promise<User>`
 *  - Exemplo de retorno: `{ id: '123', name: 'John Doe', email: 'user@example.com', password: 'hashedPassword', token: 'verificationToken123' }`
 * 
 * @example
 * ```typescript
 * async function exampleUsage() {
 *   const name = 'John Doe';
 *   const email = 'user@example.com';
 *   const password = 'securePassword123';
 *   const token = 'verificationToken123';
 * 
 *   const newUser = await createUserService(name, email, password, token);  // Cria o novo usuário
 *   console.log('Novo usuário criado:', newUser);
 * }
 * 
 * exampleUsage();
 */

export async function createUserService( email: string, password: string, name: string | null,) {
    email = email?.toLocaleLowerCase();
    name = name ? name.toLowerCase() : name;

    const user = await prisma.user.create({
        data: {
            name, email, password
        }
    })

    const token = jwtGenerate({id: user.id, name: user.name, email: user.email, password: user.password });

    const updatedUser = await updateUserService(user.id, user.name, user.email, user.password, token )

    return updatedUser;
}