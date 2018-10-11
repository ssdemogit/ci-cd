const { events, Job, Group } = require('brigadier')

events.on("push", (brigadeEvent, project) => {

  //events.on("push", function(e, project) {
  //console.log("received push for commit " + e.commit)
  var azSecret = project.secrets.Appid
  var azTenant = project.secrets.Tenant
  var azPass =   project.secrets.Secret
  //var azgroup = project.secrets.azgrp
  //var azk8s =  project.secrets.azcluster
  
  //var gitPayload = JSON.parse(brigadeEvent.payload)
  //var today = new Date()
  //var gitSHA = brigadeEvent.revision.commit.substr(0,7)
  //var imageTag = String(gitSHA)
   var gitPayload = JSON.parse(brigadeEvent.payload)
    var today = new Date()
    var gitSHA = brigadeEvent.revision.commit.substr(0,7)
    var imageTag = String(gitSHA)
    
  
  var dockerBuild = new Job("docker-build")
    dockerBuild.image = "docker:dind"
  dockerBuild.privileged = true;
  //DOCKER_DRIVER: "overlay"
  dockerBuild.env = {
    "DOCKER_DRIVER": "overlay"
      }

  dockerBuild.env.DOCKER_USER = project.secrets.dockerLogin
  dockerBuild.env.DOCKER_PASS = project.secrets.dockerPass
  
  dockerBuild.tasks = [
    "echo $imageTag",
    "docker --version",
    "dockerd-entrypoint.sh &",
    "sleep 60",
    "docker images",
    "cd /src/html",
    "docker build -t nimbus2005/html:"+imageTag+" .",
    "docker login -u $DOCKER_USER -p $DOCKER_PASS",
    "docker push nimbus2005/html:"+imageTag+""
  ]
 var deploy = new Job("job-runner-acr-builder")
    deploy.storage.enabled = false
    deploy.image = "microsoft/azure-cli:2.0.43"
    deploy.tasks = [
 'wget https://storage.googleapis.com/kubernetes-helm/helm-v2.11.0-linux-amd64.tar.gz',
 'tar xvzf helm-v2.11.0-linux-amd64.tar.gz',
  'mv linux-amd64/helm /usr/local/bin/helm' ,
 'az login --service-principal -u '+azSecret+' -p ${azPass} --tenant ${azTenant}',
 'az aks get-credentials --resource-group kubernetes --name k8s-cluster'
  ]
  deploy.run()
})
