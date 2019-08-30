const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const mySchemas = require("./graphql/schema");
const myResolvers = require("./graphql/resolvers");
const isAuth = require("./middlewares/is-auth");

const app = express();

app.use(bodyParser.json());

// Middlewares

app.use((req, res, next) => {
  console.log("Receive a request: ", req.method);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Autorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  console.log("Going to check the authentication ", req.method);
  next();
});

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: mySchemas,
    rootValue: myResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(4000);
    console.log("Server is listening on port: ", 4000);
  })
  .catch(err => {
    console.log(err);
  });
