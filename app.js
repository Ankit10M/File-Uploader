const express = require('express');
const app = express();
const dotenv = require('dotenv')
const userRoutes = require('./routes/user.route');
const connectDB  = require('./config/db');
const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index.routes')

dotenv.config()

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

connectDB()

app.set('view engine', 'ejs');

app.use('/user', userRoutes);
app.use('/',indexRouter)

app.get('/', (req, res) => {
    res.render('login', { title: 'Drive Clone' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});