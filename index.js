const authRoutes = require('./routes/auth.controller')
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors')

const connectToDB = require('./models/db'); 
const documentation = require('./swagger.json')

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', 
  preflightContinue: false     
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', authRoutes)

// Swagger options
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Supa MENU API',
        version: '1.0.0',
        description: 'API documentation for Supa MENU'
      },
      servers: [
        {
          url: 'http://localhost:3000'
        }
      ]
    },
    apis: ['./routes/*.js'] 
  };
  
  swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentation));


connectToDB()
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
