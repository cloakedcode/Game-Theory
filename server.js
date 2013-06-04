var express = require("express");
var app = express();

app.use(express.logger());

app.use('admin', express.basicAuth('admin', 'pass'));
//app.use(express.static('public'));

app.listen(9000);
console.log("Listening on port 9000...");
