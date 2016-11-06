'use strict';

const Sequelize = require('sequelize');

function Init(sequelize) {
    let Session = sequelize.define('session', {
        token: Sequelize.STRING(32)
    });

    Session.belongsTo(sequelize.models.user);
}

module.exports.Init = Init;