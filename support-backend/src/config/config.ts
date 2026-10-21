import z from 'zod';
import { getParametersByPath } from '../aws/ssm';
import { stageFromEnvironment } from '../utils/stage';

// Keys mirror the parameter names under /${stage}/support/support-backend/,
// e.g. paper-round-api/key -> paperRoundApi.key
const configSchema = z.object({
	idealPostcodesApi: z.object({
		key: z.string(),
	}),
	paperRoundApi: z.object({
		key: z.string(),
		url: z.string(),
	}),
});

export type Config = z.infer<typeof configSchema>;

const kebabToCamel = (segment: string) =>
	segment.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

export function parseConfig(
	basePath: string,
	parameters: Array<{ Name?: string; Value?: string }>,
): Config {
	const nested: Record<string, Record<string, string>> = {};

	for (const { Name, Value } of parameters) {
		// Guard here against undefined values (since the AWS type is possibly
		// undefined)
		if (Name === undefined || Value === undefined) {
			continue;
		}

		// Throw away values which aren't the format we expect e.g.
		// paper-round-api/key (without the common prefix)
		const [group, key, ...rest] = Name.slice(basePath.length + 1).split('/');
		if (group === undefined || key === undefined || rest.length > 0) {
			continue;
		}

		const groupKey = kebabToCamel(group);

		nested[groupKey] = { ...nested[groupKey], [kebabToCamel(key)]: Value };
	}

	return configSchema.parse(nested);
}

export async function loadConfig(): Promise<Config> {
	const basePath = `/${stageFromEnvironment()}/support/support-backend`;
	const configFromSsm = await getParametersByPath(basePath);
	return parseConfig(basePath, configFromSsm);
}
