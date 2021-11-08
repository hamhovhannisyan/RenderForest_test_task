const httpStatuses = require("../../configs/http-statuses");
const logger = require("../../utils/logger/winston");
const loggerTypes = require("../../configs/logger-types");
const mockData = require("../../mock/products.json");
const productMessages = require("../../configs/server-messages/products");
const productsRouter = require("express").Router();
const schemaNames = require("../../configs/schema-names");
const validator = require("../../utils/validator/ajv");
const {
  fetchAllProducts,
  getProductsPagesCount,
  createNewProduct,
  deleteProductById,
  getOneProduct,
} = require("../../services/products-service");

const getAllProducts = async (req, res, next) => {
  logger(loggerTypes.INFO, `GET /products request`);
  let response = null;

  try {
    const validationResult = validator(
      req.query,
      schemaNames.GET_PRODUCTS_QUERY_PARAMS_SCHEMA
    );
    if (validationResult !== null) {
      logger(
        loggerTypes.ERROR,
        `GET /products ${
          productMessages.GET_PRODUCTS_BAD_REQUEST
        },${JSON.stringify(validationResult)}`
      );
      res.status(httpStatuses.BadRequest);
      response = {
        status: httpStatuses.BadRequest,
        message: productMessages.GET_PRODUCTS_BAD_REQUEST,
        data: null,
        error: validationResult,
      };
    } else {
      const products = await fetchAllProducts(
        req.query.pageCount,
        req.query.page
      );
      if (products.length === 0) {
        logger(
          loggerTypes.ERROR,
          `GET /products ${productMessages.GET_PRODUCTS_NOT_FOUND}`
        );
        res.status(httpStatuses.NotFound);
        response = {
          status: httpStatuses.NotFound,
          message: productMessages.GET_PRODUCTS_NOT_FOUND,
          data: null,
          error: null,
        };
      } else {
        const pagesCount = await getProductsPagesCount(req.query.pageCount);
        response = {
          status: httpStatuses.OK,
          message: productMessages.GET_PRODUCTS_SUCCESS,
          data: {
            pages: pagesCount,
            currentPage: req.query.page,
            pagesCount: req.query.pageCount,
            products,
          },
          error: null,
        };
        logger(
          loggerTypes.INFO,
          `GET /products ${productMessages.GET_PRODUCTS_SUCCESS}`
        );
      }
    }
  } catch (e) {
    console.log(e);
    logger(
      loggerTypes.ERROR,
      `GET /products ${productMessages.GET_PRODUCTS_INTERNAL_ERROR}`
    );
    res.status(httpStatuses.InternalServerError);
    response = {
      status: httpStatuses.InternalServerError,
      message: productMessages.GET_PRODUCTS_INTERNAL_ERROR,
      data: null,
      error: e,
    };
  }

  res.json(response);
};

const createProduct = async (req, res, next) => {
  logger(
    loggerTypes.INFO,
    `POST /products request, params ${JSON.stringify(req.body)}`
  );
  let response = null;
  try {
    const validationResult = validator(
      req.body,
      schemaNames.CREATE_PRODUCT_BODY_PARAMS_SCHEMA
    );
    if (validationResult !== null) {
      logger(
        loggerTypes.ERROR,
        `POST /products request ${productMessages.GET_PRODUCTS_NOT_FOUND}`
      );
      res.status(httpStatuses.BadRequest);
      response = {
        status: httpStatuses.BadRequest,
        message: productMessages.CREATE_PRODUCT_BAD_REQUEST,
        data: null,
        error: validationResult,
      };
    } else {
      const createdProduct = await createNewProduct(req.body);
      response = {
        status: httpStatuses.OK,
        message: productMessages.CREATE_PRODUCT_SUCCESS,
        data: createdProduct,
        error: null,
      };
      logger(
        loggerTypes.INFO,
        `POST /products request ${productMessages.CREATE_PRODUCT_SUCCESS}`
      );
    }
  } catch (e) {
    logger(
      loggerTypes.ERROR,
      `POST /products request ${productMessages.CREATE_PRODUCT_INTERNAL_ERROR}`
    );
    res.status(httpStatuses.InternalServerError);
    response = {
      status: httpStatuses.InternalServerError,
      message: productMessages.CREATE_PRODUCT_INTERNAL_ERROR,
      data: null,
      error: e,
    };
  }

  res.json(response);
};

const deleteProduct = async (req, res, next) => {
  logger(
    loggerTypes.INFO,
    `DELETE /products request, params ${JSON.stringify(req.params)}`
  );
  let response = null;
  try {
    const validationResult = validator(
      req.params,
      schemaNames.DELETE_PRODUCT_PARAMS_SCHEMA
    );
    if (validationResult !== null) {
      logger(
        loggerTypes.ERROR,
        `DELETE /products request ${productMessages.DELETE_PRODUCT_BAD_REQUEST}`
      );
      res.status(httpStatuses.BadRequest);
      response = {
        status: httpStatuses.BadRequest,
        message: productMessages.DELETE_PRODUCT_BAD_REQUEST,
        data: null,
        error: validationResult,
      };
    } else {
      const product = await getOneProduct(req.params.id);
      if (product === undefined) {
        logger(
          loggerTypes.ERROR,
          `DELETE /products request ${productMessages.DELETE_PRODUCT_NOT_FOUND}`
        );
        res.status(httpStatuses.NotFound);
        response = {
          status: httpStatuses.NotFound,
          message: productMessages.DELETE_PRODUCT_NOT_FOUND,
          data: null,
          error: null,
        };
      } else {
        const deletedProduct = await deleteProductById(req.params.id);
        response = {
          status: httpStatuses.OK,
          message: productMessages.DELETE_PRODUCT_SUCCESS,
          data: deletedProduct,
          error: null,
        };
        logger(
          loggerTypes.INFO,
          `DELETE /products request ${productMessages.DELETE_PRODUCT_SUCCESS}`
        );
      }
    }
  } catch (e) {
    logger(
      loggerTypes.ERROR,
      `DELETE /products request ${productMessages.DELETE_PRODUCT_INTERNAL_ERROR}`
    );
    res.status(httpStatuses.InternalServerError);
    response = {
      status: httpStatuses.InternalServerError,
      message: productMessages.DELETE_PRODUCT_INTERNAL_ERROR,
      data: null,
      error: e,
    };
  }
  res.json(response);
};

const loadMockData = async (req, res, next) => {
  let response = null;
  mockData.forEach((product) => {
    createNewProduct(product);
  });
  response = {
    status: httpStatuses.OK,
    message: null,
    data: null,
    error: null,
  };
  res.json(response);
};

productsRouter.get("/", getAllProducts);
productsRouter.post("/", createProduct);
productsRouter.get("/load-mock", loadMockData);
productsRouter.delete("/:id", deleteProduct);
module.exports = productsRouter;
