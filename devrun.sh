#!/usr/bin/env bash

yarn devrun &
yarn storybook --ci &
sbt devrun
