#!/usr/bin/env bash

yarn devrun &
yarn storybook &
cd ..; sbt -mem 2048 "project support-frontend" devrun
