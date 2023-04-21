const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info : {
            title: "Linkive Backend",
            version: "1.0.0",
            description: "Linkive REST API Documentation"
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./src/app/Folder/*.js", "./src/app/Image/*.js", "./src/app/Memo/*.js", "./src/app/Pagesheet/*.js", "./src/app/User/*.js", "./src/app/swaggerModel.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {swaggerUi, specs};