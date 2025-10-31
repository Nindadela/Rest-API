require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./src/routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
res.send('Server is running!');
});

app.use('/api', routes); 



app.use((req, res) => {
res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).json({ message: "Internal server error" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
