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

var deploy = new Job("deploy-runner", "microsoft/azure-cli:2.0.43")
deploy.tasks = [
   'az login --service-principal -u ${appId} -p ${azPass} --tenant ${azTenant}',
   'az aks get-credentials --resource-group ${azgroup} --name ${azk8s}' 
]  
   var helm = new Job("job-runner-helm")
    helm.storage.enabled = false
    helm.image = "dtzar/helm-kubectl"
helm.tasks = [
      'helm upgrade lumbering-molly /src/mychart/Chart.yaml'
  ]  
helm.run()   
})
