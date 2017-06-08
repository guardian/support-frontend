#!/usr/bin/env python

import json
import yaml
from os import listdir
from string import Template


def read_file(filename):
    f = open(filename)
    cts = f.read()
    f.close()
    return cts

def get_lambdas():
    lambda_list = [read_file('src/lambdas/' + f) for f in listdir('src/lambdas/') if f.endswith('.yaml')]
    lambda_string = '  ' + '\n'.join(lambda_list).replace('\n', '\n  ')
    environment_variables = read_file('src/environment-variables.yaml')
    return Template(lambda_string).safe_substitute({'environment_variables': environment_variables})

def get_state_machine():
    state_machine_retries = read_file('src/state-machine-retries.yaml')
    state_machine_template = Template(read_file('src/state-machine.yaml')).safe_substitute({'state_machine_retries': state_machine_retries})
    return json.dumps(yaml.load(state_machine_template))

template = Template(read_file('src/cfn-template.yaml'))

params = {
    'state_machine_json': get_state_machine(),
    'lambdas': get_lambdas()
}

print template.substitute(params)
