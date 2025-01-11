const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
const dotenv = require ('dotenv');
const path = require ('path');

// load environment variable
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

//middleware
app.use(express.json());
app.use(cors());

//mongodb connection
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("connected to mongodb"))
.catch((err) => console.log("MongoDB connection error:", err));


//api routes
app.use('/api/chat', require('./routes/chatRoutes.js'));

// Serve static files from React build
// For any other routes, serve the React app
app.use(express.static(path.join(__dirname, 'client/src/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/src/build', 'index.html'));
});




// start the server
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});