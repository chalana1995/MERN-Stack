const express = require('express');
require("dotenv").config();
const mogoose = require('mongoose');

const app = express();


//middleware
app.use(express.json({extended: false}))

// db
mogoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("DB Connected");
})

app.get('/', (req, res) => res.send('API Running'));


// define Route
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`sever started on port ${PORT}`))