const express = require('express');
// hbs = express.js template engine plugin for Handlebars (templating engine)
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
// 'views' folder is the default folder
// which hbs will look for view template file
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
       if(err) {
           console.log('Unable to append to server.log');
       } 
    });
    next();
});

/*
app.use((req, res, next) => {
    res.render('maintenance.hbs');
});
*/

// to direct access to static html file, 
// simply go to '/xxx.html', xxx is the name of html file, e.g. 'help.html' 
app.use(express.static(__dirname + '/public'));

// Helper to inject a global var/props/function that accessible 
// by all view templating file
// 1st argument: name of the helper
// 2nd argument: function to run
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

app.get('/', (req, res) => {
    // res.send('Hello Express');
    // res.send({
    //     name: 'Andrew',
    //     likes: [
    //         'Biking',
    //         'Cities'
    //     ]
    // });
    
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website'
    });
});

app.get('/about', (req, res) => {
    // res.send('About page');
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
   res.send({
       errorMessage: 'Unable to handle request'
   }); 
});

app.listen(process.env.PORT, () => {
    console.log(`Server is up on ${process.env.PORT}...`);
});

// by default, nodemon will not automatic watch for the changes in hbs file
// need to explicitly specify in command line to watch for extension js, hbs
// e.g. 'nodemon server -e js,hbs'
// but if not using nodemon, we still can run the server by "node server"
