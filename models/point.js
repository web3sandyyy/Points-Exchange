'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Point extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Point.belongsTo(models.Dev, { foreignKey: 'devId' });
    }
  }
  Point.init(
    {
      devId: DataTypes.INTEGER,
      point: DataTypes.INTEGER,
      reason: DataTypes.STRING // Adding the new reason attribute
    },
    {
      sequelize,
      modelName: 'Point',
    }
  );
  return Point;
};
