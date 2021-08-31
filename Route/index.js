const AuthencationRoute = require('./AuthencationRoute');
const UserRoute = require('./User');
const RouteRoute = require('./Route');
const carRoute = require('./CarRoute');
const tripRoute = require('./TripRoute');
const ticketRoute = require('./TicketRoute');
const Statistical = require('./StatisticalRoute');
const Comment = require('./CommentRoute');
const Vote = require('./VoteRoute');
function Route(app){
    
    app.use('/auth' , AuthencationRoute);
    app.use('/user' , UserRoute);
    app.use('/route' , RouteRoute);
    app.use('/car' , carRoute);
    app.use('/trip',  tripRoute);
    app.use('/ticket',  ticketRoute);
    app.use('/statistical',  Statistical);
    app.use('/comment',  Comment);
    app.use('/vote', Vote);
  
}

module.exports = Route;