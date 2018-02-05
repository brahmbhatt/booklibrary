'use strict';
module.exports = (sequelize, DataTypes) => {
  var books = sequelize.define('books', {
    Author: DataTypes.STRING,
    id: DataTypes.STRING,
    Name: DataTypes.STRING,
    rating: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return books;
};