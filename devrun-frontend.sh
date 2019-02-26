#!/usr/bin/env bash

sbt "project support-frontend" devrun &
cd support-frontend; yarn devrun &
yarn storybook --ci &
