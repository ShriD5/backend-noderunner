require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const sandboxRoutes = require('./routes/sandbox');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

//database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

//routes to user and sandbx
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', sandboxRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
