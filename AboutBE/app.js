const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios");
const https = require("https");
const fs = require("fs");
const mongo = require("mongodb");

//load the env file
dotenv.config({ path: path.join(__dirname, "creds.env") });

const app = express();

app.use(cors());
app.use(express.json());

//this is the db connection string
const dburi = process.env.MONGO_URI;

//the point of this is to make sure that the content type is application/json
//the container is exposed only to it's own network but better be safe than sorry
axios.defaults.headers.post["Content-Type"] = "application/json";

//i need to load the certificate and key so my server can run on https
const options = {
  key: fs.readFileSync(process.env.KEY).toString(), //this is the private key
  cert: fs.readFileSync(process.env.CERT).toString(), //this is the certificate
};

const PORT = process.env.PORT || 8080;

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

//the nodemailer will connect to my domain autoreply email to do the business

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

//TODO Make proper routing. This is hard to navigate

app.post("/send", (req, res) => {
  const { name, email, company, message, lang, token } = req.body;

  //this is for me
  const date = new Date().toLocaleString("en-GB", {
    timezone: "Europe/Athens",
  });

  const mailMe = {
    from: process.env.EMAIL,
    to: process.env.MYEMAIL,
    subject: "New Message",
    html: `<p>Name: ${name}</p>
        <p>Date: ${date}</p>
        <p>Email: ${email}</p>
        <p>Company: ${company}</p>
        <p>Message: ${message}</p>`,
  };

  //there will be a different response depending on the language the front end is in
  let outBody = "";
  let outSubject = "";
  if (lang === "en") {
    outBody = `<p>Thank you for contacting me ${name}.</p> 
                   <p>I will get back to you as soon as possible.</p>
                   <br><br>
                   <p>This is an automated response. </p>
                   <p>Please do not reply to this email. </p>`;
    outSubject = "Thank you for contacting me";
  } else if (lang === "gr") {
    outBody = `<p>Σας ευχαριστώ για το ενδιαφέρον ${name}. 
       <p>Θα επικοινωνήσω μαζί σας το συντομότερο δυνατό. <br><br> 
       <p>Αυτή είναι μια αυτοματοποιημένη απάντηση. 
       <p>Παρακαλώ μην απαντήσετε σε αυτό το email.`;
    outSubject = "Σας ευχαριστώ που επικοινωνήσατε μαζί μου";
  }

  const mailThem = {
    from: process.env.EMAIL,
    to: email,
    subject: outSubject,
    html: `<p>${outBody}</p>`,
  };

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`;

  const verifyCaptcha = async () => {
    try {
      const response = await axios.post(url);
      const data = response.data.success;
      console.log("success " + data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const captchaResponse = verifyCaptcha();
  console.log("const" + captchaResponse);

  if (captchaResponse) {
    transporter.sendMail(mailMe, (err) => {
      console.log(err);
    });

    transporter.sendMail(mailThem, (err) => {
      if (err) {
        if (lang === "en") {
          res.status(500).send("something went wrong");
          console.log(err);
        } else if (lang === "gr") {
          console.log(err);
          res.status(500).send("Κάτι πήγε στραβά.");
        }
      } else {
        if (lang === "en") {
          res.status(200).send("Message successfully submitted.");
        } else if (lang === "gr") {
          res.status(200).send("Το μήνυμα στάλθηκε επιτυχώς.");
        }
      }
    });
  } else {
    if (lang === "en") {
      res.status(500).send(" Something went wrong with the captcha");
    } else if (lang === "gr") {
      res.status(500).send("Κάτι πήγε στραβά.");
    }
  }
});

//this is the route for the projects

app.get("/projects", async (req, res) => {
  try {
    const client = await mongo.MongoClient.connect(dburi, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("about");
    const projects = await db.collection("projects").find().toArray();

    res.status(200).json(projects);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

app.get("/picnames", (req, res) => {
  try {
    const pics = fs.readdirSync("/carouselPics");
    pics.sort();
    //sorting is not REALLY needed, but since all the photos except grove street have names that start with uppercase it's a good way to ensure it is always placed last

    const picsArray = [];
    pics.forEach((pic, i) => {
      const key = i;
      let nameEl;
      let name;
      const path = pic;
      if (pic === "grove_grove.webp") {
        nameEl = "Αν ξέρεις, ξέρεις";
        name = "If you know, you know";
      } else {
        name = pic.split("_")[0];
        nameEl = pic.split("_")[1].split(".")[0];
      }
      picsArray.push({ key, nameEl, name, path });
    });

    res.status(200).json(picsArray);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});
