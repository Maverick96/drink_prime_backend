// models
const models = require('../models');
const lead = models.Lead;

function leadDetails(req, res, next) {
    lead.findOne({
        where: {
            leadId: req.body.leadId
        }
    })
        .then(details => {
            console.log("Details ", details);
            let data = {};
            if (details) {
                data = details.dataValues
            }
            res.json({
                data
            })
        })
        .catch(err => {
            console.error(err);
            next(err);
        })
}

module.exports = leadDetails;