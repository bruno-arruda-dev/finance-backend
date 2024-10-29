import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function customErrorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    if (error.validation) {
        const formattedErrors = error.validation.map((err: any) => {
            return {
                path: err.path,
                message: err.message
            };
        });

        console.log(formattedErrors)

        reply.status(400).send({
            error: true,
            message: formattedErrors
        });
    }
    if (error.statusCode === 401) {
        reply.status(401).send({
            error: true,
            message: error.message
        });
    }
    if (error.statusCode === 409) {
        reply.status(409).send({
            error: true,
            message: error.message
        });
    } else {
        reply.status(error.statusCode || 500).send({
            statusCode: error.statusCode || 500,
            error: "Internal Server Error",
            message: error.message || "An unexpected error occurred"
        });
    }
}
