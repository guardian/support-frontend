import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { awsConfig } from '@modules/aws/config';
import type { z } from 'zod';
import type { Stage } from '../model/stage';

export async function getConfig<I, O, T extends z.ZodType<O, z.ZodTypeDef, I>>(
	stage: Stage,
	configKeyName: string,
	schema: T,
): Promise<O> {
	const ssmClient = new SSMClient(awsConfig);
	const params = {
		Name: `/${stage}/support/support-workers/${configKeyName}`,
		WithDecryption: true,
	};
	const command = new GetParameterCommand(params);
	const response = await ssmClient.send(command);
	if (response.Parameter?.Value === undefined) {
		throw new Error(
			`Parameter ${params.Name} not found or has no value in SSM`,
		);
	}
	return schema.parse(JSON.parse(response.Parameter.Value));
}

export class ServiceProvider<T> {
	defaultService: T | undefined;
	testService: T | undefined;

	constructor(
		private stage: Stage,
		private serviceCreator: (stage: Stage) => Promise<T>,
	) {}

	private async getDefaultService(): Promise<T> {
		if (!this.defaultService) {
			this.defaultService = await this.serviceCreator(this.stage);
		}
		return this.defaultService;
	}

	private async getTestService(): Promise<T> {
		if (!this.testService) {
			this.testService = await this.serviceCreator('CODE');
		}
		return this.testService;
	}

	async getServiceForUser(isTestUser: boolean): Promise<T> {
		return isTestUser
			? await this.getTestService()
			: await this.getDefaultService();
	}
}
