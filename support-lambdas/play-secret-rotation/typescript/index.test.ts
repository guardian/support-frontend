import {
	GetParameterCommand,
	PutParameterCommand,
	SSMClient,
} from '@aws-sdk/client-ssm';
import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handler } from './index';

const parameterName = '/support/frontend/CODE/play.http.secret.key';
const now = new Date('2026-11-18T12:00:00Z');

type SendMock = MockInstance<(command: unknown) => Promise<unknown>>;

const mockSsm = (lastModifiedDate: Date | undefined): SendMock => {
	const send = vi.spyOn(SSMClient.prototype, 'send') as unknown as SendMock;
	send
		.mockResolvedValueOnce({
			Parameter: { Name: parameterName, LastModifiedDate: lastModifiedDate },
		})
		.mockResolvedValue({});
	return send;
};

const sentCommands = <T>(
	send: SendMock,
	commandClass: new (...args: never[]) => T,
): T[] =>
	send.mock.calls
		.map(([command]) => command)
		.filter((command): command is T => command instanceof commandClass);

describe('play-secret-rotation handler', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(now);
		vi.stubEnv('PLAY_SECRET_PARAMETER_NAME', parameterName);
		vi.spyOn(console, 'log').mockImplementation(() => undefined);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllEnvs();
		vi.restoreAllMocks();
	});

	it('throws if the parameter name env var is missing', async () => {
		vi.stubEnv('PLAY_SECRET_PARAMETER_NAME', '');
		const send = mockSsm(new Date('2026-11-01T00:00:00Z'));

		await expect(handler()).rejects.toThrow('PLAY_SECRET_PARAMETER_NAME');
		expect(send).not.toHaveBeenCalled();
	});

	it('throws if the parameter has no LastModifiedDate', async () => {
		const send = mockSsm(undefined);

		await expect(handler()).rejects.toThrow('No LastModifiedDate');
		expect(sentCommands(send, PutParameterCommand)).toHaveLength(0);
	});

	it('does not rotate if the parameter was modified within the last two hours', async () => {
		const send = mockSsm(new Date('2026-11-18T10:00:01Z'));

		await handler();

		expect(sentCommands(send, PutParameterCommand)).toHaveLength(0);
	});

	it('rotates the parameter if it was last modified more than two hours and 3 minutes ago', async () => {
		const send = mockSsm(new Date('2026-11-18T09:56:59Z'));

		await handler();

		const gets = sentCommands(send, GetParameterCommand);
		expect(gets.map((command) => command.input)).toEqual([
			{ Name: parameterName, WithDecryption: false },
		]);

		const puts = sentCommands(send, PutParameterCommand);
		expect(puts).toHaveLength(1);
		expect(puts[0]?.input).toMatchObject({
			Name: parameterName,
			Type: 'SecureString',
			Overwrite: true,
		});
		expect(puts[0]?.input.Value).toMatch(/^[0-9a-f]{64}$/);
	});
});
