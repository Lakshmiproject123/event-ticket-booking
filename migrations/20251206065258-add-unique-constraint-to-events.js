'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Events', {
      fields: ['title', 'date', 'location'],
      type: 'unique',
      name: 'unique_event_title_date_location'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Events', 'unique_event_title_date_location');
  }
};
