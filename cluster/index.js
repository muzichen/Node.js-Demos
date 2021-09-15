const express = require('express');
const app = express();
const PORT = 9000;

app.get('/', (req, res) => {
  res.send('Hello Node Cluster');
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
  console.log(`App is listening on port ${PORT}`);
});