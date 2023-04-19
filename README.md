# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

File Description:

Express_server.js:  defines routes and functions, and handles user authentication and authorization using cookies and bcrypt.

urls_index.ejs: contains a table with short URLS and their corresponding long URLs, with options to edit and delete using Bootstrap and JavaScrip

urls_login.ejs: the  HTML file contains a login form with email and password fields, styled using the Bootstrap framework.

urls_new.ejs: page with a form to create a TinyURL and it uses Bootstrap for styling.

urls_register.ejs:  html file containing a registration form using Bootstrap and JavaScript libraries

urls_show.ejs:  displays a card with a TinyURL for a long URL and allows users to edit the URL through a form, using Bootstrap CSS and JS.

_header.ejs:  file contains a navbar with links to various URLs, along with a login/logout and register section.

helperTest.js: This is a test file that uses the Chai testing library to test the findUserByEmail function against a hardcoded testUsers object.

helper.js: this helper funtion searches through the list of users after taking in an email and then it returns the user object with the matching email, if non is found it returns null