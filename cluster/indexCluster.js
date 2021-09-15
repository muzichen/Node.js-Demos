// https://blog.appsignal.com/2021/02/03/improving-node-application-performance-with-clustering.html

const express = require('express');
const PORT = 9000;
const cluster = require('cluster');
const totalCpus = require('os').cpus().length;

console.log(`This computer has ${totalCpus} CPUs.`)

if (cluster.isMaster || cluster.isPrimary) { // 判断是否为主进程，如果为主进程创建子进程
  console.log(`There are ${totalCpus} CPUs`);
  console.log(`Primary ${process.pid} is running`);
  for (let i = 0; i < totalCpus; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log('Lets fork another worker!');
    cluster.fork();
  });
} else {
  const app = express();
  console.log(`Worker ${process.pid} started`);

  app.get('/', (req, res) => {
    res.send(`Hello Node Cluster for Worker ${process.pid}`);
  });
  
  app.get('/api/:n', (req, res) => {
    let n = parseInt(req.params.n);
    let count = 0;
    if (n > 5000000000) n = 5000000000;
  
    for (let i = 0; i <=n; i++) {
      count += i;
    }
  
    res.send(`Result is ${count}`);
  });

  app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT} for Worker ${process.pid}`)
  });
}