const mongoose = require("mongoose");
const express = require("express");
const { MONGO_USER, MONGO_PASSWORD, DBNAME } = require("./config");
const app = express();
var cors = require('cors')
const path = require('path')

app.use(express.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')))

mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.qgggw.mongodb.net/${DBNAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true, 
  useCreateIndex: true,
  useUnifiedTopology: true
}, (err)=> {
  if(err) throw err;
  console.log("Connected to MongoDB Database")
});

app.use("/auth", require("./routes/auth")); 
app.use("/video", require("./routes/videoRoutes"));
app.use("/api", require("./routes/routes"));
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

var server = app.listen(process.env.PORT || 8000, () =>
  console.log(`server started on ${process.env.PORT || 8000}`)
);

process.on("exit" || "uncaughtException" || "SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});