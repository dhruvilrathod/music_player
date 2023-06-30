const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.get('/', function (req, res) {
  // res.header('iaushdfoiuashdfoasidhfpoasidfhopasidfhpoasdf')
  // res.cookie('temp1', 'sidhfiasdfiasudf');
  // res.cookie('temp2', 'ssdfd');
  // res.cookie('temp3', '6548468');
  setTimeout(() => {
    res.json('Hello World 132')    
  }, 3000);
});

app.get('/setTempToken', function (req, res) {
  console.log(req.headers);
  res.cookie('token=eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJIaW1hbnNodSBzaGFybWEiLCJpZCI6NzcsImVtYWlsIjoic3VyZXNoQGFzaXRlLmNvbSIsInN1YiI6InN1cmVzaEBhc2l0ZS5jb20iLCJpYXQiOjE2ODE4MTUxNjYsImV4cCI6MTY4MTg0OTcyNn0.6L_fehBgP3Z2bXTf5J4Zi2qFZWbZd8yYUeURI9gBphU');
  res.json('absdkfagsidufoaisudf')
});

app.post('/fake', (req, res) => {
  res.json('sccesss')
})

app.get('/fake', (req, res) => {
  console.log('api hit');
  console.log(req.url, new Date().getTime());

  setTimeout(() => {
    res.json(new Date().getTime())    
  }, 12000);
})

app.listen(3001, () => {
  console.log('app is running');
  // app.delete();
});

// function checkType(num = 30) {

//   console.log(typeof num,);

// }

 

// checkType();

// checkType(undefined);

// checkType("");

// checkType(null);