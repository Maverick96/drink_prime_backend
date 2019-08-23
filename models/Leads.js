'use strict';
module.exports = (sequelize, DataTypes) => {
    const Lead = sequelize.define('Lead', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        leadId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [10, 10]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        address: {
            type: DataTypes.STRING,
        },
        area: {
            type: DataTypes.STRING,
        }
    }, {});
    Lead.associate = function (models) {
        // associations can be defined here
    };
    return Lead;
};
