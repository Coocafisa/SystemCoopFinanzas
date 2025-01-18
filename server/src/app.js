const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const error = require('./red/error');
const users = require('./moduls/users/routes');
const auth = require('./moduls/auth/routes');
const emails = require('./moduls/emails/routes');
const session = require('./moduls/sessions/routes');
const admin = require('./moduls/admin/routes');
const invoices = require('./moduls/invoices/routes');
const userManagement = require('./moduls/userManagement/routes');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({
    origin: config.app.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.set('port', config.app.port);
app.set('emailConfig', {
    client: config.apiEmail.client,
    email_user: config.apiEmail.email_user,
    client_secret: config.apiEmail.client_secret,
    refresh_token: config.apiEmail.refresh_token
});
app.set('MYSQL', {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
app.set('trust proxy', 1);

app.use('/auth', auth);
app.use('/session', session);
app.use('/users', users);
app.use('/emails', emails);
app.use('/admin', admin)
app.use('/invoices', invoices)
app.use('/userManagement', userManagement)
app.use(error);

module.exports = app;