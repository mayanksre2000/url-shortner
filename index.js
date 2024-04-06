const express = require("express"); //npm i express
const path = require('path')
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>  // 27017 is port that came after doing mongosh on terminal
  console.log("Mongodb connected")
);

app.use(express.urlencoded({ extended: false })); //as we are using form(form as in submit waala in html) data we need this 
app.use(express.json());  //to get json as in body

app.set("view engine", "ejs"); //after doing npm i ejs   we are setting our view engine
app.set("views", path.resolve("./views")); //telling where to see our ejs files from

// app.use("/", staticRoute);
app.use("/url", urlRoute);  //if I have /url in last it will route us to urlroute

app.get("/url/:shortId", async (req, res) => {   // :shortid   means shortid is getting from parameters 
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
