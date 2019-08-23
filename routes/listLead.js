// models
const models = require('../models');
const lead = models.Lead;
function listItems(req, res, next) {
    let sort = req.query.sortby ? req.query.sortby : 'leadId';
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    sort = sort.toString();
    let sortType = 'ASC';
    if (sort[0] == '-') {
        sortType = 'DESC'
        sort = sort.replace('-', '');
    }
    console.log("SORT BY ", sort, offset, limit)
    Promise.all([
        lead.findAll({
            offset: offset,
            limit: limit,
            order: [
                [sort, sortType]
            ]
        }),

        lead.findAll({
            attributes: ['leadId'],
        })
    ])
        .then(leadsData => {
            res.json({
                data: leadsData[0],
                total: leadsData[1].length
            })
        })
        .catch(err => {
            console.error(err);
            next(err);
        })

}

module.exports = listItems;