#!/usr/bin/env bash

yarn devrun &
yarn storybook &
cd ..; sbt "project support-frontend" devrun
