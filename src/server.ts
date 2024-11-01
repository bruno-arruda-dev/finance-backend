import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { customErrorHandler } from './errors/error-handler';
import { UserRoutes } from './routes/user-routes';
import { EnvironmentRoutes } from './routes/environment-routes';

const app = fastify();

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.register(cors, {
    origin: (origin, callback) => {
        console.log("Origin received:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: true,
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

app.register(UserRoutes.get);
app.register(UserRoutes.post);
app.register(UserRoutes.userLogin);
app.register(UserRoutes.put);
app.register(EnvironmentRoutes.post);

app
    .listen({ port: 3333 })
    .then(() => {
        console.log('Servidor Finance no ar!');
    });