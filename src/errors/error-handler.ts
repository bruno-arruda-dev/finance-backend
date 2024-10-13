import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function customErrorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    console.log(error)
    if (error.validation) {
        const formattedErrors = error.validation.map((err: any) => {
            return {
                path: err.path,
                message: err.message
            };
        });

        reply.status(400).send({
            statusCode: 400,
            error: "Bad Request",
            message: formattedErrors
        });
    } else {
        reply.send(error);
    }
}
