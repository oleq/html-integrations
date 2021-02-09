#!/bin/bash

# Activate job control so we can call fg
set -m

export DEPLOY="/plugins/deploy"

# Unpack the WAR
rm -rf "${DEPLOY}/pluginwiris_engine"
unzip "${DEPLOY}/java-${EDITOR}/pluginwiris_engine.war" -d "${DEPLOY}/pluginwiris_engine"

# Run the default command of the Docker image. Send it to the background
catalina.sh run &

# Wait for Tomcat to be up and running
# Try loading http://localhost:8080 until we read something
while [ -z "$page" ]; do
    page=$(curl -s "http://localhost:8080")
done

# Deploy the services
curl -u test:testpass "http://localhost:8080/manager/text/deploy?path=/pluginwiris_engine&update=true&config=&war=/plugins/deploy/pluginwiris_engine"

# Bring Tomcat back to foreground
fg
