const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { verifyToken } = require('./services/user/authMiddleware');
const app = express();
app.use(cookieParser());
app.use(morgan('dev'));


dotenv.config({ path: './env/.env' });
app.use(express.static('public'));

app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.URL_CLIENT,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const getSession = require('./services/functions/sessions');
app.use('/managerSession', verifyToken, getSession);

const authentication = require('./services/user/authentication');
app.use('/auth', authentication);

const addusers = require('./services/user/addusers');
app.use('/adduser', verifyToken, addusers);

const queryinvoices = require('./services/user/invoices/queryIndex');
app.use('/queryindex', verifyToken, queryinvoices);

const resetpass = require('./services/email/emailpassword/resetpassword');
app.use('/recoverypass', resetpass);

const queryUsers = require('./services/user/admin/registeredUsers');
app.use('/queryusers', verifyToken, queryUsers);

const querysAdmin = require('./services/user/admin/querysAdmin');
app.use('/programmatemails', verifyToken, querysAdmin);

const emailsProgrammer = require('./services/user/admin/emailsProgrammer');
app.use('/emailsprogrammer', verifyToken, emailsProgrammer);

const { router: shedulEmails, scheduleJob } = require('./services/user/admin/shedulEmails');
app.use('/shedulEmails', verifyToken, shedulEmails);
scheduleJob();

app.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(200).json({ message: 'Serrando sesión...', redirect: '/' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error inesperado en el servidor.' });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log('Servidor en ejecución.');
});