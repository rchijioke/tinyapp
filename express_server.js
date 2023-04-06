const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const router = express.Router()


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  //  const alphaNum = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += alphaNum[Math.floor(Math.random() * alphaNum.length)];
  }
  return result;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => { 
const shortUrl = req.params.id
  const templateVars = { id: shortUrl, longURL: urlDatabase[shortUrl] };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortUrl = generateRandomString();
  const longUrl = req.body.longURL;
  urlDatabase[shortUrl] = longUrl;
  res.redirect(`/urls/${shortUrl}`);
});

app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  // the delete operator will remove the URL
  delete urlDatabase[id];
  // then redirect the client back to the urls_index page
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username); 
  res.redirect("/urls"); 
});

router.post('/urls/:id', (req, res) => {
  const  id  = req.params; // Get the ID from the route parameter
  const  longURL  = req.body; // Get the new long URL from the request body
  // Redirect the client back to /urls
  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = router;

