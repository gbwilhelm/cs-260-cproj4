const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/bank', {
  useNewUrlParser: true
});

// Create a scheme for clients in the bank.
const clientSchema = new mongoose.Schema({
  name: String,
  address: String,
  pin: String,
  amount: Number,
  history: String
});

// Create a model for clients in the bank.
const Client = mongoose.model('Client', clientSchema);

// Create a new client in the bank: takes a name, address, pin number, and initial deposit (can be 0), has transaction history.
app.post('/api/clients', async (req, res) => {
  const client = new Client({
    name: req.body.name,
    address: req.body.address,
    pin: req.body.pin,
    amount: req.body.amount,
    history: req.body.history,
  });
  try {
    await client.save();
    res.send(client);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the clients in the bank.
app.get('/api/clients', async (req, res) => {
  try {
    let clients = await Client.find();
    res.send(clients);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Deletes a client from the database
app.delete('/api/clients/*', async (req, res) => {
  try {
    let id = req.originalUrl.slice(13,req.originalUrl.length);
    await Client.deleteOne({_id: id});
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Edits an client's info in the database
app.put('/api/clients/*', async (req, res) => {
  try {
    let id = req.originalUrl.slice(13,req.originalUrl.length);
    let client = await Client.findOne({_id: id});
    client.name = req.body.name;
    client.address = req.body.address;
    client.pin = req.body.pin;
    client.amount = req.body.amount;
    client.history = req.body.history;
    await client.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3001, () => console.log('Server listening on port 3001!'));
