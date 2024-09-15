import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createUser } from './routes/create-user';
import { createEnvironment } from './routes/create-environment';

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createUser)
app.register(createEnvironment)


app
    .listen({ port: 3333 })
    .then(() => {
        console.log('Servidor Finance no ar!');
    });