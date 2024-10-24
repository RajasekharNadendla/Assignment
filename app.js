const express = require('express');
const mongoose = require('mongoose');
const seatRoutes = require('./routes/seats');
const path = require('path');
require('dotenv').config();

const app = express();


app.use(express.json()); 

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/seats', seatRoutes);

const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
