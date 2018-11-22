#!/usr/bin/env bash
# For PR Builds, have the target be the branch we are merging into
if [[ -n "${TRAVIS_PULL_REQUEST_BRANCH}" ]];  then
  export CI_COMMIT_BEFORE_SHA="${TRAVIS_BRANCH}"
#  For push builds (currently disabled) do the last commit
else
  export CI_COMMIT_BEFORE_SHA="HEAD~1"
fi
