const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = 3000;
const survey = require('./Model/Survey');
//for converting the documents to csv
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'data.csv',
    header: [
        {id: 'name', title: 'Name'},
        {id: 'age', title: 'Age'},
        {id:'sex',title:"Sex"},
        {id:'platform',title:"Platform"},
        {id:'frequency',title:"Frequency"}
    ],
    append: false
});


//connect to mongodb 
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sudip:MongoDB123@cluster0.iwq7e3d.mongodb.net/survey', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...'));


// Path: index.html
app.get('/', (req, res) => {
    //respond the static index.html file
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

//route to handle post request
app.post('/survey', async(req, res) => {
    const obj = new survey({
        name: req.body.name,
        age: req.body.age,
        sex : req.body.sex,
        platform: req.body.platform,
        frequency: req.body.frequency
    });
    await obj.save().then((data)=>{
        res.status(200).send('Data saved successfully');
        
    })
    .catch(err => {
        res.status(400).send('Unable to save to database');
        console.log(err);
    }
    );


});

//get all the survey data
app.get('/data', async(req, res) => {
    try {
        const data = await survey.find();
        await csvWriter.writeRecords(data);
        //check if file is empty        
        const csvFile = `${__dirname}/data.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="' + 'data.csv' + '"');
        res.download(csvFile);
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


