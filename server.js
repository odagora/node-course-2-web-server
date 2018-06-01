const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//Heroku port configuration:
const port = process.env.PORT || 3000;

//Express calling into a variable
var app = express();

//To register partials as view modules to reuse in general templates:
hbs.registerPartials(__dirname + '/views/partials');

//To serve dynamic content we can use the handlebars wrapper called 'hbs' passing the first argument as the type and the second the extension:
app.set('view engine', 'hbs');

//The creation of middlewares can be done with the 'use' method. We pass the 'req', 'res' arguments or objects with a third argument 'next' that tells node to continue with the code:
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
        console.log('Unable to append to server.log');
    }
  });
  next();
});

//Make a maintenance page using a middleware. It's important to define it just after the views render:
// app.use((req, res, next) => {
//   res.render('maintenance');
// });

//To serve a static content we use the express middleware with the 'use' method. To grab the path of the project we use the '__dirname' variable and append the static folder:
app.use(express.static(__dirname + '/public'));

//We can use helpers. To register we use the following method that takes two arguments: first the name of the helper and second the function to run:
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

//A helper with an argument to capitalize text:
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//express 'get' http request. It takes two arguments: first the route and second the function to execute. The latest takes two arguments: 'req', 'res'. 'req' handles all the request info and 'res' handles the response:
// app.get('/', (req, res) => {
//   //Content-Type: text/html:
//   // res.send('<h1>Hello Express!</h1>');
//   // Content-Type: application/json:
//   res.send({
//     name: 'Daniel',
//     likes: [
//       'Swimming',
//       'Reading',
//       'Coding'
//     ]
//   });
// });

app.get('/', (req, res) => {
  res.render('home', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Hi, you are in the homepage!',
    // currentYear: new Date().getFullYear()
  });
});

app.get('/about', (req, res) => {
  //Send the static content:
  // res.send('About Page');
  // Send the dynamic content and pass some dynamic data:
  res.render('about', {
    pageTitle: 'About Page',
    //Use the date js function for the current year:
    // currentYear: new Date().getFullYear()
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle the request'
  });
});
//Server start defining a port:
app.listen(port, () => {
  console.log(`Server up and running in port ${port}`);
});
