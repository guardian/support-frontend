const Handlebars = require('handlebars'),
  fs = require('fs'),
  yaml = require('js-yaml')

//We need to deal with the statemachine and its retries separately because they are
//converted to Json before inclusion in the final cfn output
const stateMachinePartials = {
  retry: loadTemplate('retries.yaml'),
  catch: loadTemplate('catch.yaml')
}
const stateMachine = Handlebars.compile(loadTemplate('state-machine.yaml'))
const stateMachineYaml = stateMachine({}, {partials: stateMachinePartials})
const stateMachineJson = JSON.stringify(yaml.load(stateMachineYaml))

const mainPartials = {
  lambda: loadTemplate('lambda.yaml'),
  environmentVariables: loadTemplate('environment-variables.yaml'),
  stateMachine: stateMachineJson,
}
const main = Handlebars.compile(loadTemplate('cfn-template.yaml'))
const output = main(yaml.load(readFile('view.yaml')), {partials: mainPartials})

fs.writeFileSync('../target/cfn.yaml', output, 'utf-8')

function loadTemplate (filename) {
  return readFile('templates/' + filename)
}

function readFile (filename) {
  return fs.readFileSync(filename, 'utf-8')
}