const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "signup.html"));
});

app.post("/", function (req, res) {
  const firstName = req.body.FirstName;
  const lastName = req.body.LastName;
  const email = req.body.Email;
  console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/ce1ecb598d";
  const options = {
    method: "POST",
    auth: "ashim:13efdf37901b594aa085fc35e6f1088e-us21",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(path.join(__dirname, "sucess.html"));
    } else {
      res.sendFile(path.join(__dirname, "failure.html"));
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("server is running on", PORT);
});

// audience Id ce1ecb598d
