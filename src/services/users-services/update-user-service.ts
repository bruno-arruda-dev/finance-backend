import { prisma } from "../../lib/prisma";

/**
 * Atualiza as informações de um usuário existente no banco de dados com base no seu ID.
 * 
 * @param id - O ID do usuário que será atualizado.
 *  - Tipo: `string`
 *  - Exemplo: `'123456789'`
 * 
 * @param name - O novo nome do usuário. Opcional.
 *  - Tipo: `string | undefined`
 *  - Exemplo: `'John Doe'`
 * 
 * @param email - O novo email do usuário. Opcional.
 *  - Tipo: `string | undefined`
 *  - Exemplo: `'user@example.com'`
 * 
 * @param password - A nova senha do usuário. Opcional.
 *  - Tipo: `string | undefined`
 *  - Exemplo: `'securePassword123'`
 * 
 * @param token - O novo token do usuário. Opcional.
 *  - Tipo: `string | undefined`
 *  - Exemplo: `'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...'`
 * 
 * @returns Uma `Promise` que resolve para o objeto do usuário atualizado.
 *  - Tipo: `Promise<User>`
 *  - Exemplo de retorno: `{ id: '123', name: 'John Doe', email: 'user@example.com', password: 'newHashedPassword' }`
 * 
 * @example
 * ```typescript
 * async function exampleUsage() {
 *   const id = '123456789';
 *   const updatedUser = await updateUserService(id, 'John Doe', 'newemail@example.com', 'newSecurePassword123');
 *   
 *   console.log('Usuário atualizado:', updatedUser);
 * }
 * 
 * exampleUsage();
 * ```
 * 
 * @remarks
 * - Apenas os campos fornecidos (`name`, `email`, `password`) serão atualizados. Se algum deles não for passado, o valor atual será mantido.
 * 
 * @note
 * - A função `prisma.user.update` requer que o campo `id` seja válido e exista no banco de dados.
 */

export async function updateUserService(id: string, name: string | null, email?: string, password?: string, token?: string) {
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