const express = require("express");
const bodyParser = require("body-parser");
const rpcFunctions = require("./routes/apiRoute");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

app.use("/api", rpcFunctions);

const port = process.env.PORT || 5200;



server = app.listen(port, () => console.log(`Server running on port ${port}`));