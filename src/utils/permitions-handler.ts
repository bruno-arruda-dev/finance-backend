/**
 * Converte uma string com valores separados por vírgula para um array de strings.
 * 
 * @param permitions - Uma string com valores separados por vírgula.
 * 
 *  - Type: `string | string[]`
 *  - Exemplo: `'editar,compartilhar,deletar'` ou
 *
 * @returns Retorna um array de strings.
 * 
 *  - Type: `string | string[]`
 *  - Exemplo: `'editar,compartilhar,deletar'` -> `['editar', 'compartilhar', 'deletar']`
 */
export const permitionsStringToArray = (permitions: string) => {
    return permitions.split(',');
}

/**
 * Converte um array de strings para uma string com valores separados por vírgula.
 * 
 * @param permitions - Um array de strings.
 * 
 *  - Type: `string | string[]`
 *  - Exemplo: `['editar', 'compartilhar', 'deletar']`
 *
 * @returns Se o input for um array de strings, retorna uma string com valores separados por vírgula.
 *          Se o input for uma string com valores separados por vírgula, retorna um array de strings.
 *  - Type: `string | string[]`
 *  - Exemplo: `'editar,compartilhar,deletar'` -> `['editar', 'compartilhar', 'deletar']` ou `['editar', 'compartilhar', 'deletar']` -> `'editar,compartilhar,deletar'`
 */
export const permitionsArrayToString = (permitions: string[]) => {
    return permitions.join(',');
}