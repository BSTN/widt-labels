const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const exec = require('child_process').exec;
const port = 4445

const Sequelize = require('sequelize');
const connection = require('./setup/connection.json');

const { DataTypes } = Sequelize;

const sequelize = new Sequelize({
  database: connection.database,
  username: process.env.MYSQL_USER,
  host: connection.host,
  port: connection.port,
  password: process.env.MYSQL_PASSWORD,
  dialect: 'mariadb'
});

const LABEL = sequelize.define('label', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userid: { type: DataTypes.STRING },
  reactie: { type: DataTypes.TEXT },
  labels: { type: DataTypes.JSON },
  customlabels: { type: DataTypes.JSON }
});

LABEL.sync().catch(err => {
  console.log('cannot create labels table')
})

app.all('/pull', async (req, res, next) => {
  const command = "git pull"
  var child = exec(command, { cwd: "./../" })
  const alldata = []
  child.stdout.on('data', function (data) {
    alldata.push(data)
  })
  child.stderr.on('data', function(data) {
    alldata.push('stderr: ' + data);
  });
  child.on('close', function (code) {
    res.send({alldata})
  })
  
})

app.all('*', async (req, res, next) => {
  res.header({
   "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": '*',
    "Access-Control-Expose-Headers": '*'
  })
  next()
})

app.use(bodyParser.json())

// put
app.put('/', async (req, res, next) => {
  // insert into database
  const result = await LABEL.create(req.body).catch(err => {
    res.status(500).send(err.message)
  })
  if (result) { res.send(result) }
})

// check
app.all('/', async (req, res, next) => {
  res.send({ 'ok': 'thank you.' })
})

app.all('/results', async (req, res, next) => {
  const all = await LABEL.findAll()
  res.send(all)
})

app.listen(port, () => {
  console.log(`API is running on port ${port}`)
})