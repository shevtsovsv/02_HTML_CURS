'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectAsset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       ProjectAsset.belongsTo(models.project, {
         foreignKey: "project_id",
         allowNull: false,
       });
    }
  }
  ProjectAsset.init({
    file_url: DataTypes.STRING,
    file_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProjectAsset',
  });
  return ProjectAsset;
};