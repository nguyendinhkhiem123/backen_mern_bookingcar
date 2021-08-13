const expess = require('express');
const app = expess();
const port = process.env.PORT || 4000;
const dotenv = require("dotenv")


const cors = require('cors');
const Route = require('./Route/index');
const db = require('./Config/db/index');

dotenv.config()


app.use(cors());
app.use(expess.json());


// connect mongodb
db.connect();


// router api
Route(app);

app.listen(port ,()=> console.log(`server đang chạy port : ${port}`));