const models = require('../models');
const lead = models.Lead;

function create(req, res, next) {
    lead.create(req.body)
        .then(leadData => {
            res.json({
                success: true
            })
        })
        .catch(err => {
            console.error(err);
            next(err)
        })
}

module.exports = create;