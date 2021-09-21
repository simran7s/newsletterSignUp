const express = require("express");
// const bodyParser = require("body-parser") // DEPERCATED 
const request = require("request")
// const https = require("https") // dont need this for mailChimp anymore
const mailChimp = require("@mailchimp/mailchimp_marketing")

const app = express();
// app.use(bodyParser.urlencoded({ extended: true })) //used for parsing the form inputs
// NEW VERSION OF ABOVE
app.use(express.urlencoded());

// Telling app that the static files are located in the public folder
app.use(express.static("public"));

const APIKEY = "2e9e32954fa1f64b79574dcc47647d2b-us5";
const listID = "26e273b5b7";



app.get("/", function (req, res) {
        res.sendFile(__dirname + "/signup.html")
})

app.post("/failure", function (req, res) {
        res.redirect("/")
})


// post route
app.post("/", function (req, res) {
        const firstName = req.body.fname
        const lastName = req.body.lname
        const email = req.body.email

        console.log(firstName, lastName, email)

        // Data we will send to mail chimp
        const data = {
                members: [
                        {
                                email_address: email,
                                status: "subscribed",
                                merge_fields: {
                                        FNAME: firstName,
                                        LNAME: lastName
                                }

                        }
                ]
        }

        // Turn our data into string
        const jsonData = JSON.stringify(data);
        console.log("STRINGIFIED DATA")
        const URL = "https://us5.api.mailchimp.com/3.0/lists/26e273b5b7";
        const options = {
                method: "POST",
                auth: "simran7s:2e9e32954fa1f64b79574dcc47647d2b-us5"
        }
        console.log("Created variables")

        // Setting mailChimp configs
        mailChimp.setConfig({ apiKey: APIKEY, server: "us5" })

        const run = async () => {
                const response = await mailChimp.lists.addListMember(listID, data.members[0]);

                if (res.statusCode == 200) {
                        res.sendFile(__dirname + "/success.html")
                }

                console.log(response);


        }

        run().catch(e => res.sendFile(__dirname + "/failure.html"));


        // DOES NOT WORK Making our post request (USE response bc we already used res)
        // const request = https.request(URL, options, function (response) {

        //         console.log("in request")
        //         // Checking for response we get back
        //         response.on("data", function (data) {
        //                 console.log("in request")
        //                 console.log(JSON.parse(data));
        //         })

        //         // send data to mailchimp
        //         request.write(jsonData);
        //         request.end();
        // })

})
// process.env.PORT defines the port as whatever heroku sets -- it will also work on port 3000 
app.listen(process.env.PORT || 3000, function () {
        console.log("App open on port 3000")
})




