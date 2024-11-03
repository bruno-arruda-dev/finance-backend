
# Backend para Controle Financeiro

## Visão Geral

Este projeto é um backend desenvolvido em Node.js para uma aplicação web de controle financeiro. A aplicação permite que usuários gerenciem suas movimentações financeiras de maneira segura, permitindo compartilhamento com outros usuários.

## Documentação

[Clique aqui e acesse a documentação interativa com Swagger](https://finance-backend-7fxw.onrender.com/docs)

* Após o passo 3 da instalação do projeto, já será possível acessar http://http://localhost:3333/docs/ para verificar a documentação interativa com Swagger.

## Requisitos Funcionais
* ### Usuários
[x] Cadastro de usuários.

[x] Login de usuários.

[x] Atualização dos dados do usuário.

* ### Cadastro de ambientes
[x] Cadastro de ambientes.

[ ] Compartilhamento de ambientes.

* ### Cadastro de carteiras
[x] Cadastro de carteiras.


* ### Cadastro de Títulos Financeiros.

[ ] Cadastro  de títulos financeiros.

[ ] Baixa de títulos financeiros.

[ ] Delete lógico de títulos financeiros.

[ ] Compartilhamento de títulos financeiros.

* ### Gestão

[ ] Dashboard financeiro.

* ### Documentação interativa

[x] Swagger.

## Instalação

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`DATABASE_URL` //Caminho para o banco de dados. Se preferir rodar localmente defina "file:./dev.db"

`JWT_SECRET_KEY` // SecretKey utilizada para geração do JsonWebToken

`ALLOWED_ORIGINS` // Origens permitidas pelo CORS (string separadas por vírgula. Ex.: 'localhost:3000,https://brunoarrudadev.com')

**1** Instale as dependências

```bash
  npm i
```

**2** Crie o banco de dados
```bash
  npx prisma migrate dev
```

**3** Execute o projeto
```bash
  npm run dev
```

## Endpoints
#### Cadastro de usuário

```http
  POST /users
```

| Parâmetro   | Tipo       | Request Data | Descrição                           |
| :---------- | :--------- | :----------- | :---------------------------------- |
| `name` | `string null` | Body | Nome do usuário |
| `email` | `string` | Body | Email válido do usuário |
| `password` | `string min 8` | Body | Senha para login |
| `passwordConfirmation` | `string min 8` | Body | Precisa ser igual a senha |

#### Retorna um item

```http
  POST /environments
```

| Parâmetro   | Tipo       | Request Data | Descrição                                   |
| :---------- | :--------- | :----------- | :------------------------------------------ |
| `name`      | `string` | Body | O nome do ambiente |
| `token`      | `string` | Bearer Token | Token gerado ao cadastrar usuário |