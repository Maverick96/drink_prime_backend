const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan');
const bodyParser = require('body-parser');

// sequelize models
const models = require('./models');

// constants
const port = process.env.PORT || 5000;

// middlewares
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

// routes
const login = require('./routes/login');
const create = require('./routes/createLead');
const listItems = require('./routes/listLead');
const leadDetails = require('./routes/leadDetails')
const auth = require('./auth/verify');

app.use('/api/v1/login', login);
app.post('/api/v1/createLead', auth.verifyToken, create);
app.get('/api/v1/listLeads', auth.verifyToken, listItems);
app.post('/api/v1/leadDetails', auth.verifyToken, leadDetails);


// Error Handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

// connect db
models.sequelize.sync().then(function () {
    app.listen(port, () => console.log("server started at port " + port));
});
