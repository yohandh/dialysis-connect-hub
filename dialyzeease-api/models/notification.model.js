module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define("notification", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    recipient_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    recipient_role: {
      type: Sequelize.ENUM('admin', 'staff', 'patient', 'doctor'),
      allowNull: false
    },
    title: {
      type: Sequelize.STRING(128),
      allowNull: false
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('email', 'sms', 'app'),
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('pending', 'sent', 'failed', 'read'),
      allowNull: false,
      defaultValue: 'pending'
    },
    sent_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: false,
    tableName: 'notifications'
  });

  Notification.associate = (models) => {
    // Associate with User model
    Notification.belongsTo(models.user, {
      foreignKey: 'recipient_id',
      as: 'recipient'
    });
  };

  return Notification;
};
