const express = require('express');
const app = express();
const port = 3000;
const sequelize = require('./config/sequelize')
const passport = require('./middlewares/authPassport');
const session = require('express-session')
const bodyParser = require('body-parser');
const srv = require('./routes/serveurRoutes')
const canalsrv = require('./routes/canalTextuelRoutes')
const cors = require ('cors')


const Routes = require('./routes/groupe')
const login = require('./routes/login')
const register = require('./routes/register')
const facebook = require('./routes/facebook')
const google = require('./routes/google')
const profile = require('./routes/profile')
const messagePrv = require('./routes/messagePrv')
const administrateur = require('./routes/admin')
const messageGrp = require('./routes/messageGrp')
const messageSrv = require('./routes/messageRoutes')

const configureSockets = require('./middlewares/socket');

const http = require('http');

const server = http.createServer(app);
const io = configureSockets(server);

io.on('connection', (socket) => {
  console.log('Nouvelle connexion socket :', socket.id);

  // Écoutez les événements de chat ici
  socket.on('newMessage', (newMessage) => {
    console.log('Nouveau message reçu sur le serveur :', newMessage);

    // Diffusez le nouveau message à tous les clients connectés
    io.emit('newMessage', newMessage);
  });

  // ... (d'autres événements socket.io si nécessaire)
});


const fileUpload = require('express-fileupload');
app.use(fileUpload())

app.set('view engine', 'ejs');
app.use(express.json())
app.use(bodyParser.urlencoded({extended : false}));
app.use(passport.initialize());
app.use(session({ secret: process.env.code, resave: true, saveUninitialized: true }));
app.use(passport.session());
app.use(cors());

app.set('sequelize',sequelize);
app.use('/',Routes)
app.use('/',login)
app.use('/',register)
app.use('/',facebook)
app.use('/',google)
app.use('/',profile)
app.use('/',messagePrv)
app.use('/',srv)
app.use('/',canalsrv)
app.use('/',administrateur)
app.use('/',messageGrp)
app.use('/',messageSrv)


  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });