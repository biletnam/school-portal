'use strict';

const Sequelize = require('sequelize');
const helper = require('./model-helper');

function Init(sequelize) {
    let Group = sequelize.define('group', {
        name: helper.nonEmptyString(8),
    });

    Group.belongsTo(sequelize.models.course);
    Group.belongsTo(sequelize.models.specialty);
}

module.exports.Init = Init;