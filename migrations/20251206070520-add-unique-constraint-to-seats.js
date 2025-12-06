module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Seats', {
      fields: ['eventId', 'seatNumber'],
      type: 'unique',
      name: 'unique_event_seatNumber'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Seats', 'unique_event_seatNumber');
  }
};
