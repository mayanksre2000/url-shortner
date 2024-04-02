const express = require("express"); //npm i express
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>  // 27017 is port that came after doing mongosh on terminal
  console.log("Mongodb connected")
);

app.use(express.json());  //to get json as in body

app.use("/url", urlRoute);  //if I have /url in last it will route us to urlroute

app.get("/:shortId", async (req, res) => {   // :shortid   means shortid is getting from parameters 
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
