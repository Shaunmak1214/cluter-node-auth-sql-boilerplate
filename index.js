const os = require('os');
let numOfCpus = os.cpus().length;
const cluster = require('cluster');
const { clusteringApp } = require('./app');

numOfCpus = 2;

if (cluster.isMaster) {
  console.log('Primary process ' + process.pid + ' spinning up');

  for (var i = 0; i < numOfCpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  clusteringApp();
  console.log('Worker process ' + process.pid + ' spinning up');
}
