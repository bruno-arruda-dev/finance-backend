import fastify from 'fastify';
import cors from '@fastify/cors'
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { createUser } from './routes/create-user';
import { createEnvironment } from './routes/create-environment';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { userLogin } from './routes/users-login';
import { authMiddleware } from './middlewares/auth-middleware';
import { customErrorHandler } from './errors/error-handler';

const app = fastify();

app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

app.setErrorHandler(customErrorHandler);

app.register(fastifySwagger, {
    swagger: {
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {
            title: 'Finance Backend',
            description: 'Especificações da API do sistema Finance',
            version: '1.0.0'
        }
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    prefix: "/docs"
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createUser)
app.register(createEnvironment, { preHandler: authMiddleware });
app.register(userLogin)


app
    .listen({ port: 3333 })
    .then(() => {
        console.log('Servidor Finance no ar!');
    });