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

template = Template(read_file('src/cfn-template.yaml'))

state_machine = json.dumps(yaml.load(read_file('src/state-machine.yaml')))

params = {
    'state_machine_json': state_machine,
    'lambdas': get_lambdas()
}

print template.substitute(params)
