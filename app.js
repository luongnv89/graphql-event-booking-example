const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const app = express();

const mySchemas = require("./graphql/schema");
const myResolvers = require("./graphql/resolvers");
const isAuth = require('./middlewares/is-auth');
app.use(bodyParser.json());

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
