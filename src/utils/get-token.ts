import jwt from 'jsonwebtoken';

type payload = {
    id: string,
    name: string | null,
    email: string,
    password: string
}

type res = {
    token: string,
    payload: payload
}

/**
 * Extrai e verifica um token JWT a partir do cabeçalho de autorização HTTP. Decodifica o token e retorna o payload junto com o token original.
 * 
 * @param authorization - O cabeçalho de autorização no formato `'Bearer <token>'`. Opcional.
 *  - Tipo: `string | undefined`
 *  - Exemplo: `'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSJ9...'`
 * 
 * @returns Um objeto contendo o token original e o payload decodificado (com os campos `id`, `name`, `email` e `password`), ou `null` se o cabeçalho ou o token forem inválidos.
 *  - Tipo: `{ token: string, payload: { id: string, name: string, email: string, password: string } } | null | Error`
 *  - Exemplo de retorno válido: `{ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', payload: { id: '123', name: 'John Doe', email: 'user@example.com', password: 'hashedPassword' } }`
 *  - Exemplo de erro: `JsonWebTokenError: invalid signature`
 * 
 * @example
 * ```typescript
 * function exampleUsage() {
 *   const authorizationHeader = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSJ9...';
 *   const result = getToken(authorizationHeader);  // Extrai e verifica o token JWT
 *   
 *   if (result && !('error' in result)) {
 *     console.log('Token válido:', result.token);
 *     console.log('Payload decodificado:', result.payload);
 *   } else {
 *     console.error('Erro ao processar o token:', result);
 *   }
 * }
 * 
 * exampleUsage();
 * ```
 * 
 * @remarks
 * - A função usa a chave secreta definida pela variável de ambiente `JWT_SECRET_KEY`, ou `'minha_senha_jwt'` como valor padrão.
 * 
 * @note
 * - A função retorna diretamente o erro capturado (`error`) em caso de falha na verificação do token.
 * 
 */
export function getToken(authorization?: string): res | null {
    const secretKey = process.env.JWT_SECRET_KEY || 'minha_senha_jwt';

    if (!authorization) return null;

    const token = authorization.split(' ')[1];

    if (!token) return null;

    try {
        const decoded: any = jwt.verify(token, secretKey)
        const { id, name, email, password } = decoded

        return {
            token, payload: {id, name, email, password}
        };
    } catch (error: any) {
        console.error(error)
        return error;
    }
}