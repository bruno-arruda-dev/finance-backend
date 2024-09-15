import jwt from 'jsonwebtoken';

type args = {
    id: string | null;
    name: string | null;
    email: string;
    password: string | Promise<string>;
}

/**
 * Gera um token JWT (JSON Web Token) para um usuário com base em suas informações fornecidas.
 * 
 * @param id - O ID do usuário.
 *  - Tipo: `string`
 *  - Exemplo: `'123456789'`
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
 * @returns O token JWT gerado.
 *  - Tipo: `string`
 *  - Exemplo: `'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OSIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTYzOTk2OTYwMCwiZXhwIjoxNjQwMDU2MDAwfQ.0nXotn67gXYOM8Smuz6KxDYwl6bwTIkBtICcPV1hMog'`
 * 
 * @example
 * ```typescript
 * function exampleUsage() {
 *   const user = {
 *     id: '123456789',
 *     name: 'John Doe',
 *     email: 'user@example.com',
 *     password: 'securePassword123'
 *   };
 * 
 *   const token = generateJwtToken(user);  // Gera o token JWT para o usuário
 *   console.log('Token JWT gerado:', token);
 * }
 * 
 * exampleUsage();
 * ```
 * 
 * @remarks
 * - A função usa uma chave secreta (`secretKey`) definida pela variável de ambiente `JWT_SECRET_KEY`. Caso a variável não esteja definida, o valor padrão será `'yourSecretKey'`.
 * - O token gerado expira em 24 horas (`expiresIn: '24h'`).
 * 
 * @throws {Error} Caso a chave secreta não esteja corretamente configurada, isso pode comprometer a validade do token.
 */

export function jwtGenerate({id, name, email, password}: args) {
    const secretKey = process.env.JWT_SECRET_KEY || 'minha_senha_jwt';

    const payload = { id, name, email, password };

    const token = jwt.sign(payload, secretKey, {
        expiresIn: '24h'
    });

    return token;
}