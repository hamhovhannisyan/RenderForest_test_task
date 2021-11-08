const { getProductBySearchValue } = require("../../services/search-service");
const httpStatuses = require("../../configs/http-statuses");
const searchMessages = require("../../configs/server-messages/search");
const searchRouter = require("express").Router();

const searchProduct = async (req, res, next) => {
  logger(
    loggerTypes.INFO,
    `GET /search request with params ${JSON.stringify(req.params)}`
  );
  let response = null;
  try {
    logger(
      loggerTypes.INFO,
      `GET /search ${searchMessages.SEARCH_PRODUCT_SUCCESS}`
    );
    const products = await getProductBySearchValue(req.params.searchValue);
    response = {
      status: httpStatuses.OK,
      message: searchMessages.SEARCH_PRODUCT_SUCCESS,
      data: products,
      error: null,
    };
  } catch (e) {
    logger(
      loggerTypes.ERROR,
      `GET /search ${
        searchMessages.SEARCH_PRODUCT_INTERNAL_ERROR
      },${JSON.stringify(e)}`
    );
    res.status(httpStatuses.InternalServerError);
    response = {
      status: httpStatuses.InternalServerError,
      message: searchMessages.SEARCH_PRODUCT_INTERNAL_ERROR,
      data: null,
      error: e,
    };
  }

  res.json(response);
};

searchRouter.get("/:searchValue", searchProduct);

module.exports = searchRouter;
