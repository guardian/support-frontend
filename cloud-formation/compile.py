#!/usr/bin/env python

from string import Template
import yaml, json
from os import listdir


def read_file(filename):
    f = open(filename)
    cts = f.read()
    f.close()
    return cts

template = Template(read_file('src/cfn-template.yaml'))

state_machine = json.dumps(yaml.load(read_file('src/state-machine.yaml')))

lambdas = [read_file('src/lambdas/' + f) for f in listdir('src/lambdas/') if f.endswith('.yaml')]

params = {
    'state_machine_json': state_machine,
    'lambdas': '  ' + '\n'.join(lambdas).replace('\n', '\n  ')
}

print template.substitute(params)