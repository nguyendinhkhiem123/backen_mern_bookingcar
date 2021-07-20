const paypal = require('paypal-rest-sdk');


const payPayal = (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:4000/pay/success",
          "cancel_url": "http://localhost:4000/pay/erorr"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Red Sox Hat",
                  "sku": "001",
                  "price": "10,000.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "10,000.00"
          },
          "description": "Hat for the best team ever"
      }]
    }
    
  
paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            return res.json({
                body : payment.links[i].href
            })
          }
        }
    }
  });

} 
const paySuccess = (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": "10,000.00"
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
         return res.json({
            body : 'hello'
         });
      }
 });
} 
const payErorr = (req, res) => res.send('/pay/error');



module.exports = {
    payPayal,
    paySuccess,
    payErorr
}