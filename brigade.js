const { events, Job } = require("brigadier");

events.on("push", (e, project) => {
  console.log("received push for commit " + e.commit)

  var dockerBuild = new Job("docker-build")
  
  dockerBuild.image = "docker:dind"
  dockerBuild.privileged = true

  dockerBuild.env = {
     DOCKER_DRIVER: "overlay"
  }

  //dockerBuild.env.DOCKER_USER = project.secrets.dockerLogin
  //dockerBuild.env.DOCKER_PASS = project.secrets.dockerPass

  dockerBuild.tasks = [
    "dockerd-entrypoint.sh &",
    "sleep 30",
    "docker images",
    //"cd /src/",
    //"docker build -t nimbus2005/html:v4 .",
    //"docker login -u $DOCKER_USER -p $DOCKER_PASS",
    //"docker push nimbus2005/html:v4"
  ]

  dockerBuild.run()
  })

