'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Seats', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      eventId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Events', key: 'id' },
        onDelete: 'CASCADE',
      },
      seatNumber: { type: Sequelize.STRING, allowNull: false },
      status: {
        type: Sequelize.ENUM('available', 'locked', 'booked'),
        defaultValue: 'available',
      },
      lockExpiresAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Seats');
  },
};
