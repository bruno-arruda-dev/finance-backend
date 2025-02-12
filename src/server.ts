import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { customErrorHandler } from './errors/error-handler';
import { UserRoutes } from './routes/user-routes';
import { EnvironmentRoutes } from './routes/environment-routes';
import cors from '@fastify/cors';
import { HealthRoutes } from './routes/health-route';
import { EnvironmentShareRoutes } from './routes/environment-share-routes';

const app = fastify();

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.register(cors, {
    origin: (origin, cb) => {
        if (origin && allowedOrigins.includes(origin)) {
            cb(null, true);
            return;
        }
        cb(new Error("Sem permissão para acessar o recurso"), false)
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

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

// ROUTES
app.register(UserRoutes.get);
app.register(UserRoutes.post);
app.register(UserRoutes.userLogin);
app.register(UserRoutes.put);

app.register(EnvironmentRoutes.get);
app.register(EnvironmentRoutes.post);
app.register(EnvironmentRoutes.put);
app.register(EnvironmentRoutes.delete);

app.register(EnvironmentShareRoutes.get);
app.register(EnvironmentShareRoutes.post);

app.register(HealthRoutes.get);

const port = process.env.PORT ?? 3333;

app
    .listen({ port: Number(port), host: '0.0.0.0' })
    .then(() => {
        console.log(`Servidor Finance escutando na porta ${port}`);
    });