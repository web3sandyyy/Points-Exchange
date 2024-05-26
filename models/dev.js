'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dev extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Dev.hasMany(models.Point, { foreignKey: 'devId' });
      Dev.hasMany(models.Image, { foreignKey: 'devId' });
    }
  }
  Dev.init({
    name: DataTypes.STRING,
    profile: DataTypes.STRING, // Use STRING to store the image URL or Base64 encoded image
    phoneNumber: DataTypes.STRING, // Adding the phoneNumber attribute
    password: DataTypes.STRING // Adding the password attribute
  }, {
    sequelize,
    modelName: 'Dev',
  });
  return Dev;
};
