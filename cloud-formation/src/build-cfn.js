const Mustache = require('mustache'),
    fs = require('fs'),
    yaml = require('js-yaml');


//We need to deal with the statemachine and its retries separately because they are
//converted to Json before inclusion in the final cfn output
const stateMachine = readFile('state-machine.yaml');
const stateMachineYaml = Mustache.render(stateMachine, {}, {stateMachineRetries: readFile('state-machine-retries.yaml')});
const stateMachineJson = JSON.stringify(yaml.load(stateMachineYaml));

const partials = {
    contributionCompletedLambda: readFile('lambdas/contributionCompletedLambda.yaml'),
    createPaymentMethodLambda: readFile('lambdas/createPaymentMethodLambda.yaml'),
    createSalesforceContactLambda: readFile('lambdas/createSalesforceContactLambda.yaml'),
    createZuoraSubscriptionLambda: readFile('lambdas/createZuoraSubscriptionLambda.yaml'),
    failureHandlerLambda: readFile('lambdas/failureHandlerLambda.yaml'),
    sendThankYouEmailLambda: readFile('lambdas/sendThankYouEmailLambda.yaml'),
    updateMembersDataAPILambda: readFile('lambdas/updateMembersDataAPILambda.yaml'),
    environmentVariables: readFile('environment-variables.yaml'),
    stateMachine: "           " + stateMachineJson
};

const main = readFile('cfn-template.yaml');
const output = Mustache.render(main, {}, partials);
console.log(output);
fs.writeFileSync('../target/cfn.yaml', output, 'utf-8');


function readFile(filename) {
    return fs.readFileSync(filename, 'utf-8');
}
