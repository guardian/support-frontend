const Mustache = require('mustache'),
    fs = require('fs'),
    yaml = require('js-yaml');


//We need to deal with the statemachine and its retries separately because they are
//converted to Json before inclusion in the final cfn output
const stateMachine = loadTemplate('state-machine.yaml');
const stateMachineYaml = Mustache.render(stateMachine, {}, {stateMachineRetries: loadTemplate('state-machine-retries.yaml')});
const stateMachineJson = JSON.stringify(yaml.load(stateMachineYaml));

const partials = {
    lambda: loadTemplate('lambda.yaml'),
    environmentVariables: loadTemplate('environment-variables.yaml'),
    stateMachine: indent(11, stateMachineJson)
};

const main = loadTemplate('cfn-template.yaml');
const output = Mustache.render(main, yaml.load(readFile('view.yaml')), partials);
fs.writeFileSync('../target/cfn.yaml', output, 'utf-8');

function loadTemplate(filename) {
    return readFile('templates/' + filename);
}
function readFile(filename) {
    return fs.readFileSync(filename, 'utf-8');
}
function indent(number, text) {
    return ' '.repeat(number) + text;
}
