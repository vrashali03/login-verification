require("./config/db");

const express = require("express");
const app = express();
const port = 3000;

const userRouter = require("./api/user");

//for accepting post form data
app.use(express.json());

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
