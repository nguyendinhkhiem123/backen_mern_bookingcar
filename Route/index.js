const AuthencationRoute = require('./AuthencationRoute');
const UserRoute = require('./User');
const RouteRoute = require('./Route');
const carRoute = require('./CarRoute');
const driverRoute = require('./DriverRoute');
const tripRoute = require('./TripRoute');
const ticketRoute = require('./TicketRoute');
const payRoute = require('./PaymentPayPalRoute');
function Route(app){
    
    app.use('/auth' , AuthencationRoute);
    app.use('/user' , UserRoute);
    app.use('/route' , RouteRoute);
    app.use('/car' , carRoute);
    app.use('/driver' , driverRoute);
    app.use('/trip',  tripRoute);
    app.use('/ticket',  ticketRoute);
    app.use('/pay' ,payRoute);
}

module.exports = Route;