const express = require('express');
const app = express();

const init = (data) => {
    require('./config/app.config')(app);
    require('./config/auth.config')(app, data);
    require('./routes')(app, data);

    return Promise.resolve(app);
};

module.exports = init;
