#!/bin/bash

./build-cloudformation.sh

sbt clean compile test riffRaffUpload