const { events, Job } = require("brigadier");

events.on("push", function(e, project) {
  console.log("received push for commit " + e.commit)

events.on("test-done", (e, project) =&gt; {
var dockerBuild = new Job("docker-build")

  dockerBuild.image = "docker:dind"
  dockerBuild.privileged = true; // dind needs to run in privileged mode

  dockerBuild.env = {
    DOCKER_DRIVER: "overlay"
  }

  // Place these credentials in your project YAML and update it using helm 
  dockerBuild.env.DOCKER_USER = project.secrets.dockerLogin 
  dockerBuild.env.DOCKER_PASS = project.secrets.dockerPass

  dockerBuild.tasks = [
    "dockerd-entrypoint.sh &amp;", // Start the docker daemon
    "sleep 20", // Grant it enough time to be up and running
    "cd /src/", // Go to the project checkout dir
    "docker build . -t html:v4", // Replace with your own image tag
    "docker login -u $DOCKER_USER -p $DOCKER_PASS",
    "docker push nimbus2005/html:v4", // Replace with your own image tag
  ]

  dockerBuild.run()
})

