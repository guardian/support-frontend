import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SupportFrontendPostDeploymentTestsLambda } from './support-frontend-post-deployment-tests-lambda';

describe('The SupportFrontendPostDeploymentTestsLambda stack', () => {
	it('matches the snapshot', () => {
    const app = new App();
    const codeStack = new SupportFrontendPostDeploymentTestsLambda(app, "SupportFrontendPostDeploymentTestsLambda-CODE", {
      stack: "support",
      stage: "CODE",
      env: {
        region: 'eu-west-1',
      },
    });
    const prodStack = new SupportFrontendPostDeploymentTestsLambda(app, "SupportFrontendPostDeploymentTestsLambda-PROD", {
      stack: "support",
      stage: "PROD",
      env: {
        region: 'eu-west-1',
      },
    });

    expect(Template.fromStack(codeStack).toJSON()).toMatchSnapshot();
    expect(Template.fromStack(prodStack).toJSON()).toMatchSnapshot();


		/**
		 * Snapshot testing helps to understand exactly what impact a CDK change will have on the provisioned infrastructure.
		 *
		 * @see https://github.com/guardian/cdk/blob/main/docs/best-practices.md#snapshot-testing
		 */
	});
});
