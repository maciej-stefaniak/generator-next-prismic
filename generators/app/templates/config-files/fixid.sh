#!/bin/bash

# Either use current commit hash:
git_hash=$(cat version.txt)

# or hardcoded id:
# git_hash=$(echo "--project-name--" | md5sum | awk '{print $1}')

# Write the build id to disk.
echo $git_hash | tr -d '\n' > .next/BUILD_ID
