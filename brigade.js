const { events, Job } = require("brigadier");

events.on("push", function(e, project) {
  console.log("received push for commit " + e.commit)

  // Create a new job
  var node = new Job("test-runner")

  // We want our job to run the stock Docker Python 3 image
  node.image = "nginx"

  // Now we want it to run these commands in order:
  node.tasks = [
    "COPY . /usr/share/ngin/html",
    "docker build . -t html:v4",
    "docker tag html:v4 nimbus2005/html:v4",
    "docker push nimbus2005/html:v4",
[

 node.run()
})

