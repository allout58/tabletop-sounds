#!/usr/bin/env bash

if [[ -n "${TRAVIS_PULL_REQUEST_BRANCH}" ]];  then
  export CI_COMMIT_BEFORE_SHA="${TRAVIS_PULL_REQUEST_BRANCH}"
else
  export CI_COMMIT_BEFORE_SHA="HEAD~1"
fi
