const app = require('./app');
const config = require('./config');

const Port = config.app.port;

app.listen(Port, () => {
  console.warn('Server running on port', Port);
});