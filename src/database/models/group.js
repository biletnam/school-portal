'use strict';

const Sequelize = require('sequelize');
const helper = require('./model-helper');

function Init(sequelize) {
    let Group = sequelize.define('group', {
        name: helper.nonEmptyString(8, "имя"),
    },
        {
            instanceMethods: {
                getDisplayName: function () {
                    return this.name;
                }
            }
        });

    Group.belongsTo(sequelize.models.specialty, { 
        foreignKey: { allowNull: false }, 
        onDelete: 'RESTRICT'
    });
}

module.exports.Init = Init;