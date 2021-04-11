const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description:
        "A technical content deliverable, containing instructions about how to effectively use and integrate with an API",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/"
      }
    },
    servers: [
      {
        url: "http://localhost:3000/api"
      }
    ]
  },
  apis: ["models/*.js", "routes/*.js"]
};
const specs = swaggerJsdoc(options);

module.exports = function(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
