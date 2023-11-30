const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'WAIT',
      description: 'wait 프로젝트 RestFul API 클라이언트 UI',
    },
    servers: [
      {
        url: `${process.env.AWS_HOST}:8080`, // 요청 URL
      },
    ],
  },
  apis: ['./routes/*.js', './swagger_docs/**/*.yaml'], //Swagger 파일 연동
};
const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
