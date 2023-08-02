const axios = require('axios');
const fs = require("fs")
const express = require('express');
const app = express();
const path = require('path');
const port = 4107
const bodyParser = require('body-parser');
const sanitize = require("sanitize-filename")

//getting python constants
const { spawn } = require('child_process');



app.set('view-engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.render('savenet.ejs')
})


//Sending video to user

var videoUrl = null
app.post('/api/download', (req, res) => {
    const data = req.body.title;
    const dataSize = req.body.quality;
    console.log("DATA:", data);
    console.log("DATA SIZE:", dataSize);
    getSong(data)
        .then(res.send(videoUrl))
        .catch(res.status(403).send('Request forbidden'))
})


async function getSong(id) {
    const options = {
        method: 'GET',
        url: 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl',
        params: { id: id },
        headers: {
            'X-RapidAPI-Key': '68d9af67d0msh776a02014a4f131p1bae86jsn3050f3465fae',
            'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
        }
    };
    try {
        const response = await axios.request(options);
        const data = response.data
        const formats = Object.values(data.formats)
        let highestQuality = null

        for (let format of formats)
            if (highestQuality === null) {
                highestQuality = format;
            } else {
                if (format.qualityLabel > highestQuality.qualityLabel) {
                    highestQuality = format;
                }
            }

        videoUrl = highestQuality.url;


        //the geeky part. creating a writable stream to save video file
        const videoFolder = 'media'
        if (!fs.existsSync(videoFolder)) {
            fs.mkdirSync(videoFolder)
        }
        const videoTitle = data.title;
        const sanitizedVideoTitle = sanitize(videoTitle)
        console.log(sanitizedVideoTitle)
        const videoFile = fs.createWriteStream(videoFolder + "/" + sanitizedVideoTitle + '.mp4')

        axios.get(videoUrl,
            { responseType: 'stream' })
            .then(response => {
                response.data.pipe(videoFile)
                console.log("video downloaded successfully: ")
            })
            .catch(error => {
                console.error(error)
            });

    } catch (error) {
        console.log("Try catch fail: ")
        console.error(error);
    }




}


app.post('/api/getVideos', (req, res) => {
    const data = req.body.title
    const size = req.body.quality
    try {
        console.log(data, size)
        serverData = getSongByName(data, size)
            .then((finalResult) => {
                res.status(200).send(finalResult)
            })
    } catch (e) {
        res.send(504).send('could not get files')
    }

})

function getSongByName(name, quality) {
    // create a new promise
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python", ["pythonFile.py", name, 'single']);

        let data = "";
        pythonProcess.stdout.pipe(process.stdout);
        pythonProcess.stdout.on("data", (chunk) => {
            data += chunk.toString();
        });
        pythonProcess.on("close", (code) => {
            if (data != undefined) {
                rawData = data.toString();
                // resolve the promise with the data
                resolve(rawData);
                console.log("Script end")
            } else {
                console.log("data was undefined");
                // reject the promise with an error
                reject(new Error("data was undefined"));
            }
        });
    });
}






console.log(`App running on port ${port}`)

app.listen(port)
