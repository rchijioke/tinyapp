const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const router = express.Router();
var cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

function generateRandomString() {
  const alphaNum =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += alphaNum[Math.floor(Math.random() * alphaNum.length)];
  }
  return result;
}

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const findUserByEmail = (email) => {
  for (const userId in users) {
    if (users[userId]["email"] === email) {
      return users[userId];
    }
  }
  return null;
};

const isLoggedIn = (userid) => {
  const user = users[userid];
  if (user) {
    return true;
  }
  return false
};

function urlsForUser(id) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
}




app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  if (!isLoggedIn(userId)) {
    res.status(401).send("<html><body>Please <a href='/login'>log in</a> to view URLs.</body></html>");
  } else {
  const userUrls = urlsForUser(userId)
  const templateVars = {
    user: users[userId],
    urls: userUrls,
  };
  res.render("urls_index", templateVars);
}
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", { user: undefined });
});

app.get("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id
  const shortUrl = req.params.id;
  const url = urlDatabase[shortUrl];
  if (!isLoggedIn(userId)) {
    res.status(401).send("<html><body>Please <a href='/login'>log in</a> to view this URL.</body></html>");
  } else if (!url || url.userId !== userId) {
    res.status(404).send("<html><body>URL not found or you do not have permission to view this URL.</body></html>");
  } else {
  const templateVars = { id: shortUrl, longURL: urlDatabase[shortUrl].longURL };
  res.render("urls_show", templateVars);
  }
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
  if (!longURL) {
    return res.status(404).send('URL not found');
  }
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  // const user = users["userRandomID"]
  //const user = users[req.cookies.user_id]
  // console.log("user", user)
  // const templateVars = { user };
  const userid = req.cookies.user_id
  if (isLoggedIn(userid)) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: undefined };
    res.render("urls_register", templateVars);
    console.log("here2");
  }
});

app.get("/login", (req, res) => {
  const userid = req.cookies.user_id
  if (isLoggedIn(userid)) {
   return res.redirect("/urls")
  }
  const templateVars = { user: undefined };
  res.render("urls_login", templateVars); // Render the login form template
});

app.get("/urls/new", (req, res) => {
  const user = req.user;
  const userid = req.cookies.user_id
  if(!isLoggedIn(userid)) {
    return res.redirect("/login") 
  }
  res.render("urls_new", user);
});

app.post("/urls", (req, res) => {
  const userid = req.cookies.user_id
  if(!isLoggedIn(userid)){
    res.send("Please <a href='/login'> log in </a> to create URL")
  }
  const shortUrl = generateRandomString();
  const longUrl = req.body.longURL;
  urlDatabase[shortUrl] = longUrl;
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  delete urlDatabase[id];

  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  // const user = req.body.user;
  // console.log(user);
  // store email and password from body request
  const email = req.body.email;
  const password = req.body.password;
  // for future reference
  const user = findUserByEmail(email);
  if (!user) {
    res.status(403).send("User not Found");
  } else if (user.password !== password) {
    res.status(403).send("User not Found");
  } else {
    res.cookie("user_id", user.id);
    // const userId = req.cookies.user_id;
    // const templateVars = {
    //   user: users[userId],
    //   urls: urlDatabase,
    // };

    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password required.");
  }

  if (findUserByEmail(email)) {
    return res.status(400).send("Email is already in use.");
  }
  const userId = generateRandomString();
  const newUser = {
    id: userId,
    email: email,
    password: password,
  };
  users[userId] = newUser;
  res.cookie("user_id", userId);
  res.redirect("/urls");
});

router.post("/urls/:id", (req, res) => {
  const id = req.params;
  const longURL = req.body;

  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = router;
