const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const config = require("./config");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");   
})

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us18.api.mailchimp.com/3.0/" + config.listId;

    const options = {
        method: "POST",
        auth: "luhan3:" + config.apiKey
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
        
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function (req, res) {
    res.redirect("/");   
})

app.post("/success", function (req, res) {
    res.redirect("/");   
})


app.listen(process.env.PORT | 3000, function() {
    console.log("The server is running on port 3000.");
})