import { createHmac } from 'crypto';
import express from 'express';
import request from 'supertest';
import { buildCsrfValidationMiddleware } from './csrfValidation';

const SECRET = 'test-application-secret';
const ALLOWED_ORIGINS = ['https://support.code.dev-theguardian.com'];

function signToken(
	rawToken: string,
	secret: string,
	nonce: string = Date.now().toString(),
): string {
	const signature = createHmac('sha1', secret)
		.update(`${nonce}-${rawToken}`, 'utf8')
		.digest('hex');
	return `${signature}-${nonce}-${rawToken}`;
}

const app = express();
app.post(
	'/protected',
	buildCsrfValidationMiddleware(SECRET, ALLOWED_ORIGINS),
	(_req, res) => {
		res.json({ ok: true });
	},
);
app.get(
	'/protected',
	buildCsrfValidationMiddleware(SECRET, ALLOWED_ORIGINS),
	(_req, res) => {
		res.json({ ok: true });
	},
);

describe('csrfValidation middleware', () => {
	it('allows a POST when header and cookie carry the same raw token', async () => {
		const headerToken = signToken('shared-raw-token', SECRET, '1000');
		const cookieToken = signToken('shared-raw-token', SECRET, '2000');

		const response = await request(app)
			.post('/protected')
			.set('Csrf-Token', headerToken)
			.set('Cookie', `GU_support_csrf=${encodeURIComponent(cookieToken)}`);

		expect(response.status).toBe(200);
	});

	it('allows a POST from an allowed Origin', async () => {
		const headerToken = signToken('shared-raw-token', SECRET, '1000');
		const cookieToken = signToken('shared-raw-token', SECRET, '2000');

		const response = await request(app)
			.post('/protected')
			.set('Origin', 'https://support.code.dev-theguardian.com')
			.set('Csrf-Token', headerToken)
			.set('Cookie', `GU_support_csrf=${encodeURIComponent(cookieToken)}`);

		expect(response.status).toBe(200);
	});

	it('rejects a POST from a disallowed Origin even with a valid token', async () => {
		const headerToken = signToken('shared-raw-token', SECRET, '1000');
		const cookieToken = signToken('shared-raw-token', SECRET, '2000');

		const response = await request(app)
			.post('/protected')
			.set('Origin', 'https://evil.example.com')
			.set('Csrf-Token', headerToken)
			.set('Cookie', `GU_support_csrf=${encodeURIComponent(cookieToken)}`);

		expect(response.status).toBe(403);
	});

	it('rejects a POST whose Referer origin is not allowed', async () => {
		const headerToken = signToken('shared-raw-token', SECRET, '1000');
		const cookieToken = signToken('shared-raw-token', SECRET, '2000');

		const response = await request(app)
			.post('/protected')
			.set('Referer', 'https://evil.example.com/some/path')
			.set('Csrf-Token', headerToken)
			.set('Cookie', `GU_support_csrf=${encodeURIComponent(cookieToken)}`);

		expect(response.status).toBe(403);
	});

	it('rejects a POST with a missing header', async () => {
		const cookieToken = signToken('shared-raw-token', SECRET);

		const response = await request(app)
			.post('/protected')
			.set('Cookie', `GU_support_csrf=${encodeURIComponent(cookieToken)}`);

		expect(response.status).toBe(403);
	});

	it('rejects a POST with a missing cookie', async () => {
		const headerToken = signToken('shared-raw-token', SECRET);

		const response = await request(app)
			.post('/protected')
			.set('Csrf-Token', headerToken);

		expect(response.status).toBe(403);
	});

	it('rejects a POST when header and cookie raw tokens differ', async () => {
		const headerToken = signToken('raw-token-a', SECRET);
		const cookieToken = signToken('raw-token-b', SECRET);

		const response = await request(app)
			.post('/protected')
			.set('Csrf-Token', headerToken)
			.set('Cookie', `GU_support_csrf=${encodeURIComponent(cookieToken)}`);

		expect(response.status).toBe(403);
	});

	it('rejects a POST with a tampered token signed by a different secret', async () => {
		const headerToken = signToken('shared-raw-token', 'attacker-secret');
		const cookieToken = signToken('shared-raw-token', 'attacker-secret');

		const response = await request(app)
			.post('/protected')
			.set('Csrf-Token', headerToken)
			.set('Cookie', `GU_support_csrf=${encodeURIComponent(cookieToken)}`);

		expect(response.status).toBe(403);
	});

	it('skips validation for safe methods', async () => {
		const response = await request(app).get('/protected');
		expect(response.status).toBe(200);
	});
});
