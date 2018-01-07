const express = require('express');
const app = express();
const PORT = process.env.port || 3000;

app.use(express.static('src'));

app.get('/', (req, res) => {
  res.render('index.html');
})

app.listen(PORT, console.log(`App running on port ${PORT}`));
