//Javascript

var sampleUserInput = "https://www.youtube.com/watch?v=PPVHFyd7nGo"
var largerSampleInput = 'https://www.youtube.com/watch?v=p4rRCjrAyCs&list=RDp4rRCjrAyCs&start_radio=1'

const dataSearchErr = "Could not search for the information you provided"
const dataSearchEarlyScc = "Video processing just began"
const processing = "Video processing complete."

function sendURL(data) {
    if (data) {
        if (data.includes("https://") || data.includes("http://")) {
            broadcastNotification(dataSearchEarlyScc, ": Searching for youtube link online", "ok");
            if (data.includes('://youtu.be/')) {
                id = data.split("/")[3];
                id = id.split('?')[0]
            } else {
                id = data.split("=")[1];
                if (id.includes('&')) id = id.split('&')[0]
                console.log(id);

            }
            getData(id);

        } else {
            broadcastNotification(dataSearchEarlyScc, `searching for '${data}'`, "ok");
            getDataByName(data);
        }
    } else {
        broadcastNotification(dataSearchErr, "Empty search field", "fail");
    }
}

async function getData(id) {
    const info = {
        title: id,
        quality: 'best'
    };

    fetch('/api/download', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(info)
    }).then(response => {
        console.log("Command successfully uploaded", info)
        broadcastNotification(processing, ' Downloading data', "ok");
        response.json()
    }).then((data) => {
        console.log(data)
    }).catch((err) => {
        console.log(err)
    })
}
function getDataByName(name) {
    const info = {
        title: name,
        quality: 'best'
    }

    // use .then to handle the fetch promise
    fetch('/api/getVideos', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(info)
    })
        .then((response) => {
            // use .then to handle the response text promise
            if (!response.ok) {
                broadcastNotification(dataSearchErr, "Could not reach server. Check connection", 'fail')
            } else { broadcastNotification(processing, ' Fetching videos for download', "ok"); }
            return response.text()
        })
        .then((data) => {
            console.log(data)
            startMenu('Search Results', "click on a title to download it", null, data)
        })
        // use .catch to handle any errors
        .catch((err) => {
            console.log(err)
        })
}

function verifyData(data, extent) {
    const linkRegex = /^https?:\/\/[\w\-\.]+(\.[\w\-\.]+)+\/?/;
    const nameRegex = /^([A-Z][a-z]+|[a-z]+)(\s([A-Z][a-z]+|[a-z]+))*$/i;
    console.log(data);
    if (extent === "broad") {
        if (!data) return false; // Empty string is false
        if (!linkRegex.test(data) && !nameRegex.test(data)) return false;
        else return true;
    }

}


//Notifier
let banner = document.getElementById("banner")
let bannerContent = document.getElementById("scroll-contentID")
let isLive = false
let BroadcastTime = 6000
function broadcastNotification(message, technicalMessage, type) {

    tone = (type == 'ok') ? 'success' : 'fail'
    anime({
        targets: banner,
        opacity: [0, 1],
        top: [-100, -90],
        duration: 400,
        easing: 'linear',
        begin: function () {
            banner.style.display = 'flex'
        }
    })
    if (!isLive) {
        bannerContent.innerHTML = `<p class='${tone}'>${tone}:</p><p>${message}. (Extended Info): ${technicalMessage}</p>`
    } else {
        bannerContent.innerHTML += `<p class='${tone}'>${tone}:</p><p>${message}. (Extended Info): ${technicalMessage}</p>`
        BroadcastTime += 3000;
    }
    isLive = true

    setTimeout(() => {
        anime({
            targets: banner,
            opacity: [1, 0],
            top: [-90, -100],
            duration: 400,
            easing: 'linear',
        })
        isLive = false
    }, BroadcastTime)
}


function startMenu(type, subTitle, children, rawData) {
    menuID = document.getElementById('menuID')
    menuTitle = document.getElementById('menu-title')
    menuSTitle = document.getElementById('menu-sub-title')
    menuID.style.display = 'block'
    menuTitle.innerHTML = ``; menuSTitle.innerHTML = ``
    menuTitle.innerHTML += `${type} Menu : Press ESC to leave`
    menuSTitle.innerHTML += `${subTitle}`
    illustrations = document.getElementById('illustrationsID')
    window.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            menuID.style.display = 'none'
        }
    })

    for (i = 0; i < children; i++) {
        illustrationHolder = document.createElement('div')
        illustration = document.createElement('div')
        followAlongData = document.createElement('div')
        faContainer = document.createElement('div')
        titleName = document.createElement('div')
        faContentLikes = document.createElement('div')
        faContentDownloads = document.createElement('div')
        faContentTime = document.createElement('div')

        //assigning classes and ids
        illustrationHolder.setAttribute('class', 'illustration-holder')
        illustration.setAttribute('class', 'illustration')
        followAlongData.setAttribute('class', 'follow-along-data')
        faContentLikes.setAttribute('class', 'likes fa-content')
        faContentDownloads.setAttribute('class', 'downloads fa-content')
        faContentTime.setAttribute('class', 'time fa-content')


        //adding the elements
        illustrations.appendChild(illustrationHolder)
        illustrationHolder.appendChild(illustration)
        illustrationHolder.appendChild(followAlongData)
        followAlongData.appendChild(faContentLikes)
        followAlongData.appendChild(faContentDownloads)
        followAlongData.appendChild(faContentTime)
    }

    //creating elements



}
