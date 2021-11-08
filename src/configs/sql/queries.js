module.exports = {
  GET_PRODUCTS_PAGES_COUNT: `
                      SELECT COUNT(*) as count 
                      FROM products
                    `,
  GET_PRODUCT_BY_ID: `
                      SELECT *
                      FROM products
                      WHERE "productId"=:productId
                    `,
  GET_ALL_PRODUCTS: `
                      SELECT * FROM products
                      ORDER BY "productId"
                      LIMIT :pageCount 
                      OFFSET :pageOffset
                    `,
  CREATE_NEW_PRODUCT: `
                      INSERT INTO products
                      ("productName", "productType", "productPrice")
                      VALUES (:productName, :productType, :productPrice)
                      RETURNING *
                    `,
  GET_PRODUCTS_BY_SEARCH_VALUE: `
                      SELECT * FROM products
                      WHERE "productName" ILIKE :searchValue
                    `,
  DELETE_PRODUCT_BY_ID: `
                      DELETE 
                      FROM products
                      WHERE "productId"=:productId
                      RETURNING *
                    `,
};
