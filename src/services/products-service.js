const sequelize = require("../../repositories/pg-repo");
const {
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_PAGES_COUNT,
  CREATE_NEW_PRODUCT,
  DELETE_PRODUCT_BY_ID,
  GET_PRODUCT_BY_ID,
} = require("../configs/sql/queries");
const loggerTypes = require("../configs/logger-types");
const logger = require("../utils/logger/winston");

module.exports.getProductsPagesCount = async (pageCount) => {
  logger(loggerTypes.INFO, `Executing sql query ${GET_PRODUCTS_PAGES_COUNT}`);
  const [[result]] = await sequelize.query(GET_PRODUCTS_PAGES_COUNT);

  return Math.ceil(result.count / pageCount);
};

module.exports.getOneProduct = async (productId) => {
  logger(
    loggerTypes.INFO,
    `Executing sql query ${GET_PRODUCT_BY_ID} with params ${JSON.stringify({
      productId,
    })}`
  );
  const [[result]] = await sequelize.query(GET_PRODUCT_BY_ID, {
    replacements: { productId },
  });

  return result;
};

module.exports.fetchAllProducts = async (pageCount, page) => {
  logger(
    loggerTypes.INFO,
    `Executing sql query ${GET_ALL_PRODUCTS} with params ${JSON.stringify({
      pageCount,
      pageOffset: pageCount * (page - 1),
    })}`
  );
  const [result] = await sequelize.query(GET_ALL_PRODUCTS, {
    replacements: {
      pageCount,
      pageOffset: pageCount * (page - 1),
    },
  });

  return result;
};

module.exports.createNewProduct = async (params) => {
  logger(
    loggerTypes.INFO,
    `Executing sql query ${CREATE_NEW_PRODUCT} with params ${JSON.stringify({
      replacements: params,
    })}`
  );
  const [result] = await sequelize.query(CREATE_NEW_PRODUCT, {
    replacements: params,
  });

  return result;
};

module.exports.deleteProductById = async (productId) => {
  logger(
    loggerTypes.INFO,
    `Executing sql query ${DELETE_PRODUCT_BY_ID} with params ${JSON.stringify({
      replacements: { productId },
    })}`
  );
  const [result] = await sequelize.query(DELETE_PRODUCT_BY_ID, {
    replacements: { productId },
  });

  return result;
};
