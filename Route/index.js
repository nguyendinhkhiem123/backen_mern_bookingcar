const AuthencationRoute = require('./AuthencationRoute');
const UserRoute = require('./User');
const RouteRoute = require('./Route');
function Route(app){
    
    app.use('/auth' , AuthencationRoute);
    app.use('/user' , UserRoute);
    app.use('/route' , RouteRoute);
}


module.exports = Route;