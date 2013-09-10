# SEEDO

A seed Node.js project starter for Express and AngularJS based development.

## Develpomment Stack

- Node.js
- Express
- Mongoose (MongoDB)
- AngularJS
- JavaScript
- Jade
- Stylus

## Libraries & Modules

- Passort
- Moment

## Tools Used

- Karma
- Mocha
- Grunt
- Bower

## Development Tasks

    $ npm install      // install all npm dependencies
    $ bower install    // install all bower dependency components

    $ grunt            // defaults to `grunt server`
    $ grunt server     // starts dev server using supervisor
    $ grunt test       // run all tests (server and client)
    $ grunt mocha      // run only server mocha tests
    $ grunt karma      // run only client karma tests
    
    $ grunt --help     // get a list of available tasks

Available Grunt tasks:

          exec  Execute shell commands. *                   
          copy  Copy files. * 
          libs  Copy vendor libraries from bower lib folder
      scaffold  Scaffold MongoDB model/controller/test
        server  Run the development server
          test  Run all server and client tests
         karma  Run client tests with Karma  
         mocha  Run server tests with Mocha
       default  Alias for "server" task.

