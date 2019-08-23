'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserToken = sequelize.define('UserToken', {
        tokenId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        userId: {
            allowNull: false,
            references: { model: "Users", key: "userId" },
            type: DataTypes.INTEGER,
        },
        token: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        }
    }, {});
    UserToken.associate = function (models) { };
    return UserToken;
};
