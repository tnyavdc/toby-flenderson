const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
});
  
const Points = sequelize.define('Points', {
  user: {
    type: DataTypes.STRING,
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {});

exports.getUserPoints = async (user) => {
  const points = await Points.findOne({where: {user: user}})
  if (points) {
    return points.points
  } else {
    return 0
  }
};

exports.incrementPoints = async (user) => {
  const points = await Points.findOne({where: {user: user}})
  if (points) {
    await Points.update({points: points.points + 1}, {where: {user: user}})
  } else {
   await Points.create({points: 1, user: user}) 
  }
  return true;
};
