import dayjs from 'dayjs';
import { z } from 'zod';
import type { Stage } from '../model/stage';
import { getIfDefined } from '../util/nullAndUndefined';
import { getConfig } from './config';

export const salesforceConfigSchema = z.object({
	url: z.string(),
	consumer: z.object({
		key: z.string(),
		secret: z.string(),
	}),
	api: z.object({
		username: z.string(),
		password: z.string(),
		token: z.string(),
	}),
});

const authTokenSchema = z.object({
	access_token: z.string(),
	instance_url: z.string(),
	issued_at: z.string(),
});

export type SalesforceConfig = z.infer<typeof salesforceConfigSchema>;

export const getSalesforceConfig = async (
	stage: Stage,
): Promise<SalesforceConfig> => {
	return getConfig(stage, 'salesforce-config', salesforceConfigSchema);
};

export class SalesforceClient {
	constructor(config: SalesforceConfig) {
		this.authService = new AuthService(config);
	}
	private authService: AuthService;

	post = async <I, O, T extends z.ZodType<O, z.ZodTypeDef, I>>(
		path: string,
		body: string,
		schema: T,
	): Promise<O> => {
		const auth = await this.authService.getAuthentication();
		const url = `${auth.instance_url}/${path}`;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${auth.access_token}`,
				'Content-Type': 'application/json',
			},
			body,
		});
		if (response.ok) {
			return schema.parse(await response.json());
		}
		throw new Error(`Failed to post to Salesforce: ${await response.text()}`);
	};
}

type Authentication = {
	access_token: string;
	instance_url: string;
	issued_at: string;
};

export class AuthService {
	private expiryTimeMinutes = 15;
	private auth: Authentication | undefined;
	constructor(private config: SalesforceConfig) {
		this.config = config;
	}

	authIsValid() {
		return (
			this.auth &&
			dayjs(Number(this.auth.issued_at))
				.add(this.expiryTimeMinutes, 'minutes')
				.isAfter(dayjs())
		);
	}

	async getAuthentication() {
		if (!this.authIsValid()) {
			console.log('Auth token is invalid or expired, fetching a new one');
			this.auth = await this.fetchAuthToken();
		}
		return getIfDefined(this.auth, 'No valid Salesforce authentication found');
	}

	private async fetchAuthToken(): Promise<Authentication> {
		console.log(`Trying to authenticate with Salesforce`);
		const authUrl = this.config.url + '/services/oauth2/token';
		const response = await fetch(authUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				client_id: this.config.consumer.key,
				client_secret: this.config.consumer.secret,
				username: this.config.api.username,
				password: `${this.config.api.password}${this.config.api.token}`,
				grant_type: 'password',
			}),
		});

		if (!response.ok) {
			throw new Error(
				`Failed to authenticate with Salesforce: ${response.statusText}`,
			);
		}

		this.auth = authTokenSchema.parse(await response.json());
		console.log('Authenticated with Salesforce successfully');
		return this.auth;
	}
}
