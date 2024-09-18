import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { createUser } from './routes/create-user';
import { createEnvironment } from './routes/create-environment';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const app = fastify();

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
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createUser)
app.register(createEnvironment)


app
    .listen({ port: 3333 })
    .then(() => {
        console.log('Servidor Finance no ar!');
    });