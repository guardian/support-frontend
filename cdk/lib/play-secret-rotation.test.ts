import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PlaySecretRotation } from './play-secret-rotation';

describe('The PlaySecretRotation stack', () => {
	it.each(['CODE', 'PROD'])('matches the snapshot in %s', (stage) => {
		const app = new App();
		const stack = new PlaySecretRotation(app, `PlaySecretRotation-${stage}`, {
			stack: 'support',
			stage,
		});

		const template = Template.fromStack(stack);
		expect(template.toJSON()).toMatchSnapshot();
	});
});
