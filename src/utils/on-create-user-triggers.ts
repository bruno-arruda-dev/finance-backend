import { EnvironmentService } from "../services/environment-service";


export async function onCreateUserTriggers(userId: string) {

    await EnvironmentService.post(userId, 'minha casa')
    await EnvironmentService.post(userId, 'minha empresa')

    return;
}