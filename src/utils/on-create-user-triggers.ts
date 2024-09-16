import { createEnvironmentService } from "../services/environment-services/create-environment-service";

export async function onCreateUserTriggers(userId: string) {

    await createEnvironmentService(userId, 'minha casa')
    await createEnvironmentService(userId, 'minha empresa')

    return;
}