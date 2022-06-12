const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res)=>{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const phone = req.body.number;

    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    PHONE: phone
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us9.api.mailchimp.com/3.0/lists/ec791ee3eaa";
    const options = {
        method: "post",
        auth: "albert1:05782344de4996f0a77c272f4f0f3053-us9"
    }
    const request = https.request(url, options,(response)=>{
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on('data', (data)=>{
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post('/failure', (req, res)=>{
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server started on Port 3000");
});


// apiKey : 05782344de4996f0a77c272f4f0f3053-us9
// unique id : ec791ee3ea