import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PlaySecretRotation } from './play-secret-rotation';

describe('The PlaySecretRotation stack', () => {
	it('matches the snapshot', () => {
		const app = new App();
		const stack = new PlaySecretRotation(app, 'PlaySecretRotation-CODE', {
			stack: 'support',
			stage: 'CODE',
		});

		const template = Template.fromStack(stack);
		expect(template.toJSON()).toMatchSnapshot();
	});
});
