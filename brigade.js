const { events, Job } = require("brigadier");

events.on("push", function(e, project) {
  console.log("received push for commit " + e.commit)

  // Create a new job
  var node = new Job("test-runner")

  // We want our job to run the stock Docker Python 3 image
  node.image = "nginx"

  // Now we want it to run these commands in order:
  node.tasks = [
    "cp -r src/* /usr/share/nginx/html",
    "docker build . -t html:v4",
    "docker tag html:v4 nimbus2005/html:v4",
    "docker push nimbus2005/html:v4",
 ]

  // We're done configuring, so we run the job
  node.run()
})

