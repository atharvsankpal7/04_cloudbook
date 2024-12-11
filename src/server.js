// external imports
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
// internal imports
const connectDB = require('./config/database');
const swaggerDefinition = require('../swaggerDef');
const authRoutes = require('./routes/auth.routes');
const availabilityRoutes = require('./routes/availability.routes');
const appointmentRoutes = require('./routes/appointment.routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // req.body will now contain the parsed JSON data

// Connect to Database
connectDB()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.log(`Database connection error: ${err.message}`));

// Swagger Documentation
const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ['./src/routes/*.js']
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes); //provides user with token 
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// global error handler
app.use((err, _, res, __) => {
    console.error(err.stack);
    res.status(500).send('Something broke! ' + err.message);
});

module.exports = app;