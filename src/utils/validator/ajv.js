const Ajv = require("ajv");
const validationSchema = require("./validationSchema.json");

const ajv = new Ajv({ allErrors: true, coerceTypes: true });

module.exports = (data, definition) => {
  try {
    const validate = ajv.compile(validationSchema[definition]);

    const valid = validate(data);
    return !valid ? validate.errors : null;
  } catch (ex) {
    throw new Error(ex);
  }
};
