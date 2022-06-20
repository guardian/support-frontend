export function noClientSecretError(json: unknown): Error {
	return new Error(
		`Missing client_secret field in server response: ${JSON.stringify(json)}`,
	);
}
