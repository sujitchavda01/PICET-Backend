require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routes/routes');
const { sequelize } = require('./models/model');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;


// Ensure that environment variables are properly loaded
if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing. Check your environment variables.");
    process.exit(1); // Stop the server
}
app.use(cors({
    origin: process.env.CLIENT_URL || 'https://evaluation.picet.in', // Update this with your frontend URL
    credentials: true,
    methods: ["GET", "POST","DELETE","PUT"],
}));


// Serve static files from the assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');
        await sequelize.sync({ alter: true });
        console.log('✅ Models synchronized.');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    }
})();

app.get('/', (req, res) => {
    res.send('Hello, API is running 🚀');
});

// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
module.exports = app;

