const { events, Job, Group } = require("brigadier");

events.on("push", (e, project) => {
  console.log("received push for commit " + e.commit)
  var azClientSecret = project.secrets.appId
 var azTenant = project.secrets.tenant
 var azPass =   project.secrets.pass
 var azgroup = project.secrets.azgrp
 var azk8s =  project.secrets.azcluster
  var dockerBuild = new Job("docker-build")
  
  dockerBuild.image = "docker:dind"
  dockerBuild.privileged = true;
  DOCKER_DRIVER: "overlay"
  dockerBuild.env = {
    // DOCKER_DRIVER: "overlay"
    }

  dockerBuild.env.DOCKER_USER = project.secrets.dockerLogin
  dockerBuild.env.DOCKER_PASS = project.secrets.dockerPass
  
  dockerBuild.tasks = [
    "docker --version",
    "dockerd-entrypoint.sh &",
    "sleep 60",
    "docker images",
    "cd /src/",
    "docker build -t nimbus2005/html:v4 .",
    "docker login -u $DOCKER_USER -p $DOCKER_PASS",
    "docker push nimbus2005/html:v4"
  ]
dockerBuild.run()

})
