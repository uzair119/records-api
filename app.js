const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('REST API listening on port ', port);
});

// app.get('/', async (req, res) =>  {
//   res.json({status: 'API is ready for monitoring on ' + process.env.LOCATION});
// });

app.get('/:numberPlate', async(req, res) => {
  const numberPlate = req.params['numberPlate'];
  //const geoLocation = req.params.geoLocation;
  console.log(req.params.numberPlate);
  console.log(req.params);
  console.log(req.params['numberPlate']);
  console.log(numberPlate);
  const record = await getRecord(numberPlate); 
  res.json({status:'success', data: record});
});

app.post('/', async(req, res) => {
  const record = await createRecord(req.body);
  res.json({status: 'success', data: record});
});

function createRecord(fields) {
  return new Promise(function(resolve, reject) {
    const sql = 'INSERT INTO records SET ?';
    getDbPool().query(sql, fields, (err, results) => {
      resolve(results);
    });
  });
}


let cachedDbPool;
function getDbPool() {
  if(!cachedDbPool) {
    cachedDbPool = mysql.createPool({
      connectionLimit: 1,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_NAME,
      socketPath: `/cloudsql/${process.env.INST_CON_NAME}`
    });
  }
  return cachedDbPool;
}

async function getRecord(numberPlate) {
  return new Promise(function(resolve, reject) {
    const sql = "SELECT * FROM records where number_plate=?";
    getDbPool().query(sql, [numberPlate], (err, results) => {
      console.log('results',results);
      resolve(results);
    }); 
  });
}
