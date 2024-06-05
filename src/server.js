const app = require("./app");
const PORT = process.env.PORT || 3001;
const cluster = require("cluster");
const os = require("os");
async function init() {
  try {
    if (cluster.isMaster) {
      const numCPUs = os.cpus().length;
      console.log(`Master ${process.pid} is running`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
      });
    } else {
      app.listen(PORT, () => {
        console.log(`Express server is now running on process ${process.pid}, listening on port ${PORT}`);
      });
    }
  } catch (error) {
    console.log(error);
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

init();
