import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { customErrorHandler } from './errors/error-handler';
import { createEnvironment } from './routes/create-environment';
import { UserRoutes } from './routes/user-routes';

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
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    prefix: "/docs"
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(UserRoutes.getUser);
app.register(UserRoutes.createUser);
app.register(UserRoutes.userLogin);
app.register(UserRoutes.updateUser);
app.register(createEnvironment);


app
    .listen({ port: 3333 })
    .then(() => {
        console.log('Servidor Finance no ar!');
    });