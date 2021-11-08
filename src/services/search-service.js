const { GET_PRODUCTS_BY_SEARCH_VALUE } = require("../configs/sql/queries");
const sequelize = require("../../repositories/pg-repo");

module.exports.getProductBySearchValue = async (searchValue) => {
  const [result] = await sequelize.query(GET_PRODUCTS_BY_SEARCH_VALUE, {
    replacements: {
      searchValue: `%${searchValue}%`,
    },
  });
  return result;
};
