const Handlebars = require('handlebars'),
  fs = require('fs'),
  yaml = require('js-yaml')

//create the output directory
try { fs.mkdirSync('../target'); } catch(err) { }

//We need to deal with the statemachine and its retries separately because they are
//converted to Json before inclusion in the final cfn output
let partials = {
  retry: loadTemplate('retries.yaml'),
  catch: loadTemplate('catch.yaml')
}
const stateMachine = Handlebars.compile(loadTemplate('state-machine.yaml'))
const stateMachineYaml = stateMachine({}, {partials})
const stateMachineJson = JSON.stringify(yaml.load(stateMachineYaml))

partials = {
  lambda: loadTemplate('lambda.yaml'),
  environmentVariables: loadTemplate('environment-variables.yaml'),
  stateMachine: stateMachineJson,
}
const main = Handlebars.compile(loadTemplate('cfn-template.yaml'))
const output = main(yaml.load(readFile('view.yaml')), {partials})

fs.writeFileSync('../target/cfn.yaml', output, 'utf-8')

function loadTemplate (filename) {
  return readFile('templates/' + filename)
}

function readFile (filename) {
  return fs.readFileSync(filename, 'utf-8')
}