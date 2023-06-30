const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.get('/aaa', function (req, res) {
  // res.header('iaushdfoiuashdfoasidhfpoasidfhopasidfhpoasdf')
  // res.cookie('temp1', 'sidhfiasdfiasudf');
  // res.cookie('temp2', 'ssdfd');
  // res.cookie('temp3', '6548468');
  setTimeout(() => {
    res.json('Hello World 132')    
  }, 13000);
});

app.get('/setTempToken', function (req, res) {
  console.log(req.headers);
  res.cookie('token=eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJIaW1hbnNodSBzaGFybWEiLCJpZCI6NzcsImVtYWlsIjoic3VyZXNoQGFzaXRlLmNvbSIsInN1YiI6InN1cmVzaEBhc2l0ZS5jb20iLCJpYXQiOjE2ODE4MTUxNjYsImV4cCI6MTY4MTg0OTcyNn0.6L_fehBgP3Z2bXTf5J4Zi2qFZWbZd8yYUeURI9gBphU');
  res.json('absdkfagsidufoaisudf')
});

app.get('/fake', (req, res) => {
  let template = fetch("https://www.jiosaavn.com/song/pasoori/MzkjQhx5RX8", { credentials: "include" }).then((res) => res.text()).then((val) => {
    res.send(val)
  });
})

app.get('/fake', (req, res) => {
  console.log('api hit');
  console.log(req.url, new Date().getTime());

  setTimeout(() => {
    res.json(new Date().getTime())    
  }, 12000);
})

app.listen(3000, () => {
  console.log('app21 is running');
  // app.delete();
});

process.on('uncaughtException', function (err) {
  console.log(err);
});

// function checkType(num = 30) {

//   console.log(typeof num,);

// }

 

// checkType();

// checkType(undefined);

// checkType("");

// checkType(null);