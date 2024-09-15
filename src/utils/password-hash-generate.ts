import bcrypt from 'bcrypt';

/**
 * Essa função recebe uma senha em texto plano (string) e retorna um hash criptografado (string).
 * 
 * @param password - A senha que será criptografada
 *  - Tipo: `string`
 *  - Exemplo: `'mySecurePassword'`
 * 
 * @returns Uma `Promise` que resolve para o hash criptografado da senha
 *  - Tipo: `Promise<string>`
 *  - Exemplo: `$2b$12$u.jvABt9oIxzAVPfhpFFAeQxjlpI/k0bZujT3ApLgN/Xy/91LVQta`
 * 
 * @example
 * ```typescript
 * async function exampleUsage() {
 *   const password: string = 'mySecurePassword';  // Parâmetro recebido
 *   const hashedPassword: string = await generatePasswordHash(password);  // Parâmetro retornado (Promise<string>)
 *   
 *   console.log('Senha original:', password);
 *   console.log('Senha criptografada:', hashedPassword);
 * }
 * 
 * exampleUsage();
 * ```
 */
export async function generatePasswordHash(password: string) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
}