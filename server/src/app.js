const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const error = require('./red/error');
const users = require('./modules/users/routes');
const auth = require('./modules/auth/routes');
const emails = require('./modules/emails/routes');
const session = require('./modules/sessions/routes');
const admin = require('./modules/admin/routes');
const invoices = require('./modules/invoices/routes');
const userManagement = require('./modules/userManagement/routes');
const generalService = require('./modules/generalService/routes');
const { scheduleJob } = require('./modules/emails/funtions.email/shedulEmails');

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
app.set('MYSQL', {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
app.set('trust proxy', 1);

scheduleJob();
app.use('/auth', auth);
app.use('/session', session);
app.use('/users', users);
app.use('/emails', emails);
app.use('/admin', admin)
app.use('/invoices', invoices)
app.use('/userManagement', userManagement)
app.use('/generalService', generalService)
app.use(error);

module.exports = app;