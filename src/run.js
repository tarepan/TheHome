const express = require("express");
const app = express();
app.set("port", 8000);
app.use(express.static(`${__dirname}/../dist`));

app.listen(app.get("port"), function() {
  console.log("Listening on port " + app.get("port"));
});
