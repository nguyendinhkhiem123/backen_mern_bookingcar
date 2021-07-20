const expess = require('express');
const app = expess();
const port = process.env.PORT || 4000;
const dotenv = require("dotenv")


const cors = require('cors');
const Route = require('./Route/index');
const db = require('./Config/db/index');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AR5idgRtmA6JWiQh5tANj_S04daPaSkZDKmc6ZSty3BVsLD2TAVM9A9VYdPpStuVtTkc5cS4npCKY8g1',
    'client_secret': 'ED4uYT4JOcQ6Y04hyP-NSyPvc67VEU20UcVH-mv4Wcd_AA6gIj8uyvomwNoyDC_IBXCLoRH2PuGU2CNh'
  });
dotenv.config()


app.use(cors());
app.use(expess.json());


// connect mongodb
db.connect();


// router api
Route(app);

app.listen(port , ()=> console.log(`server đang chạy port : ${port}`));