import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { z } from 'zod';
import { awsConfig } from '../awsConfig';
import type { Stage } from '../model/stage';

const payPalConfigSchema = z.object({
	user: z.string(),
	password: z.string(),
	signature: z.string(),
	nvpVersion: z.string(),
	url: z.string(),
});

type PayPalConfig = z.infer<typeof payPalConfigSchema>;

export const getPayPalConfig = async (stage: Stage) => {
	const ssmClient = new SSMClient(awsConfig);
	const params = {
		Name: `/${stage}/support/support-workers/paypal-config`,
		WithDecryption: true,
	};
	const command = new GetParameterCommand(params);
	const response = await ssmClient.send(command);
	console.log(response.Parameter?.Value);

	return payPalConfigSchema.parse(JSON.parse(response.Parameter?.Value ?? ''));
};

export class PayPalService {
	defaultNVPParams: Record<string, string>;
	constructor(private config: PayPalConfig) {
		this.defaultNVPParams = {
			USER: config.user,
			PWD: config.password,
			SIGNATURE: config.signature,
			VERSION: config.nvpVersion,
		};
	}

	logNVPResponse(response: URLSearchParams) {
		const msg = (status: string) =>
			`PayPal: ${status} (NVPResponse: ${response.toString()})`;

		const ack = response.get('ACK');
		switch (ack) {
			case 'Success':
				console.log(msg('Successful PayPal NVP request'));
				break;
			case 'SuccessWithWarning':
				console.log(msg('Warning'));
				break;
			case 'Failure':
				console.log(msg('Error'));
				break;
			case 'FailureWithWarning':
				console.log(msg('Error With Warning'));
				break;
		}
	}

	async nvpRequest(params: Record<string, string>) {
		const response = await fetch(this.config.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({ ...this.defaultNVPParams, ...params }),
		})
			.then((response) => response.text())
			.then((text) => new URLSearchParams(text));
		this.logNVPResponse(response);
		return response;
	}

	async retrieveEmail(baid: string) {
		const params = {
			METHOD: 'BillAgreementUpdate',
			REFERENCEID: baid,
		};

		const response = await this.nvpRequest(params);
		return response.get('EMAIL');
	}
}
