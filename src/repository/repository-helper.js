'use strict';

const moment = require('moment');

function Create(connection, modelName) {
    let modelAttriutes = connection.models[modelName].attributes;
    let sortingRules = [];

    if (modelAttriutes['name']) {
        sortingRules.push(['name', 'ASC']);
    }

    if (modelAttriutes['lastname']) {
        sortingRules.push(['lastname', 'ASC']);
    }

    if (modelAttriutes['start']) {
        sortingRules.push(['start', 'ASC']);
    }

    function formatAuditFields(items) {
        return items.map(item => {
            item.dataValues.createdAt = moment(item.createdAt).format('LLL');
            item.dataValues.updatedAt = moment(item.updatedAt).format('LLL');

            return item;
        });
    }

    return {
        create: (options) => connection.models[modelName].create(options),
        browse: () => connection.models[modelName].findAll({ order: sortingRules }).then(formatAuditFields),
        browseWith: (includes) => () => connection.models[modelName].findAll({
            include: includes.map(model => connection.models[model])
        }).then(formatAuditFields),
        get: (options) => connection.models[modelName].findOne({ where: options }),
        delete: (options) => connection.models[modelName].destroy({ where: options }),
        update: (entityId, options) => connection.models[modelName].update(options, { where: { id: entityId }, returning: true })
    }
}

module.exports = Create;