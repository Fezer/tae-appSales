module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Sellers",
      [
        {
          name: "José de Oliveira",
          email: "j_oliveira@mail.com",
          password: "$2a$12$mqBTbddgh33a.cAsLdmxl.qd4rZfqJRcQWQQvG4OYK4KMhfeIC4O6", //1234567a
        },
        {
          name: "Maria Carla",
          email: "mcarla@mail.com",
          password: "$2a$12$mqBTbddgh33a.cAsLdmxl.qd4rZfqJRcQWQQvG4OYK4KMhfeIC4O6", //1234567a
        },
        {
          name: "Felipe Candido",
          email: "felipe@mail.com",
          password: "$2a$12$mqBTbddgh33a.cAsLdmxl.qd4rZfqJRcQWQQvG4OYK4KMhfeIC4O6", //1234567a
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Sellers", null, {});
  },
};
