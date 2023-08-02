//Javascript

var sampleUserInput = "https://www.youtube.com/watch?v=PPVHFyd7nGo"
var largerSampleInput = 'https://www.youtube.com/watch?v=p4rRCjrAyCs&list=RDp4rRCjrAyCs&start_radio=1'

const dataSearchErr = "Could not search for the information you provided"
const dataSearchEarlyScc = "Video processing just began"
const playlistOption = "The video is part of a playlist. Download full playlist?"
const processing = "Video processing complete."

window.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        sendURL(document.getElementById('input').value)
    }
})

function sendURL(data) {
    if (data) {
        if (data.includes("https://") || data.includes("http://")) {

            if (data.includes("list=")) {
                broadcastNotification('playlist', "The video is part of a playlist, get full playlist instead?", 'ok')
                setTimeout(()=> {
                    sendURL(data.split("list=")[0])
                }, 3000)

            } else {
                broadcastNotification(dataSearchEarlyScc, ": Searching for youtube link online", "ok");
                if (data.includes('://youtu.be/')) {
                    id = data.split("/")[3];
                    id = id.split('?')[0]
                } else {
                    id = data.split("=")[1];
                    if (id.includes('&')) id = id.split('&')[0]
                    console.log(id);

                }
            }
            getData(id);

        } else {
            broadcastNotification(dataSearchEarlyScc, `searching for '${data}'`, "ok");
            getDataByName(data);
            setTimeout(() => {
                resultsSkelMenu = new MainMenu(data, null)
                resultsSkelMenu.skeletonSearchResults()
            }, 500)
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
            resultsMenu = new MainMenu("Received search results", data)
            console.log("Calling main menu for results")
            resultsMenu.searchResults()
            //startMenu('Search Results', "click on a title to download it", null, data)
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

//!Mode Switch
modeSwitch = document.getElementById("visualSlider")
spotifyExclusives = document.querySelectorAll('.spotify')
youtubeExclusives = document.querySelectorAll('.youtube')
var isSpotify = false

modeSwitch.addEventListener('mousedown', () => {
    console.log('Clicked')
    if (!isSpotify) {
        isSpotify = true;
        console.log('false');
    }
    else { isSpotify = false }

    console.log(isSpotify)

    if (isSpotify) {
        anime({
            targets: modeSwitch,
            left: '50%',
            duration: 200,
            easing: 'easeInOutQuad'
        })
        visualSlider.innerText = 'SPOTIFY'
        spotifyExclusives.forEach(exclusive => {
            exclusive.style.display = 'block'
        });
        youtubeExclusives.forEach(exclusive => {
            exclusive.style.display = 'none'
        });
    } else {
        anime({
            targets: modeSwitch,
            left: 0,
            duration: 200,
            easing: 'easeInOutQuad'
        })
        visualSlider.innerText = 'YOUTUBE'
        spotifyExclusives.forEach(exclusive => {
            exclusive.style.display = 'none'
        });
        youtubeExclusives.forEach(exclusive => {
            exclusive.style.display = 'block'
        });
    }
})




//!Notifier
var banner = document.getElementById("banner")
var opt1 = document.getElementById('notificationPrimaryOpt1')
var opt2 = document.getElementById('notificationPrimaryOpt2')
let bannerContent = document.getElementById("scroll-contentID")
let isLive = false
let BroadcastTime = 6000
function broadcastNotification(message, technicalMessage, type) {

    tone = (type == 'ok') ? 'success' : 'fail'
    opt1.style.display = 'none'
    anime({
        targets: banner,
        opacity: [0, 1],
        left: [100, 90],
        duration: 400,
        easing: 'linear',
        begin: function () {
            banner.style.display = 'flex'
        }
    })
    if (message == 'playlist') {
        opt1.style.display = 'block'
        opt1.innerText = 'Get playlist'
    }
    if (!isLive) {
        bannerContent.innerHTML = `<p class='${tone}'>${tone}:</p><p>${technicalMessage}</p>`
    } else {
        bannerContent.innerHTML += `<p class='${tone}'>${tone}:</p><p>${technicalMessage}</p>`
        BroadcastTime += 3000;
    }
    isLive = true

    setTimeout(() => {
        anime({
            targets: banner,
            opacity: [1, 0],
            left: [90, 100],
            duration: 400,
            easing: 'linear',
        })
        isLive = false
        return('closed')
    }, BroadcastTime)

}
function ignoreNotification(input) {
    if(input.includes('list=')){
        sendURL(input.split('list=')[0])
    }
    anime({
        targets: banner,
        opacity: [1, 0],
        duration: 400,
        easing: 'linear',
    })
}



class MainMenu {

    constructor(type, rawData) {
        this.type = type;
        this.rawData = rawData;
    }

    operation = new Secondary(this.rawData)

    searchResults() {
        console.log("search results page running")
        console.log(this.type)
        console.log(this.rawData)
        var reversed = this.operation.reverseArr()
        this.menuBody(reversed)

    }
    skeletonSearchResults() {
        this.menuBody(null)
        console.log("skeleton load page loading")
    }

    menuBody(reversedArr) {
        console.log("Menu body running", reversedArr)
        console.log(this.rawData)
        var menuID = document.getElementById('menuID')
        var menuTitle = document.getElementById('menu-title')
        var menuSTitle = document.getElementById('menu-sub-title')
        menuID.style.display = 'block'
        menuTitle.innerHTML = ``; menuSTitle.innerHTML = ``
        menuTitle.innerHTML += `SEARCH RESULTS FOR ${this.type.toUpperCase()}`
        menuSTitle.innerHTML += `${"subTitle"}`

        if (reversedArr != null) {
            console.log(reversedArr)
            for (var i = 0; i < reversedArr.length; i++) {
                this.resultCard("live", reversedArr)
            }
        } else {
            for (var i = 0; i < 5; i++) {
                this.resultCard("skeleton", null)
            }
        }

    }
    resultCard(type, data) {
        var illustrations = document.getElementById('illustrationsID')
        var illustrationHolder = document.createElement('div')
        var illustration = document.createElement('div')
        var followAlongData = document.createElement('div')
        var faContainer = document.createElement('div')
        var titleName = document.createElement('div')
        var faContentLikes = document.createElement('div')
        var faContentDownloads = document.createElement('div')
        var faContentTime = document.createElement('div')
        // var illustrationImage = document.createElement('img')
        // illustrationImage.src = randomImages()

        //assigning classes and ids
        illustrationHolder.setAttribute('class', 'illustration-holder')
        illustration.setAttribute('class', 'illustration')
        followAlongData.setAttribute('class', 'follow-along-data')
        faContainer.setAttribute('class', 'fa-container')
        faContentLikes.setAttribute('class', 'likes fa-content')
        faContentDownloads.setAttribute('class', 'downloads fa-content')
        faContentTime.setAttribute('class', 'time fa-content')

        if (type == "live") {
            console.log("Live is running")
            //adding the elements
            illustration.setAttribute('class', 'illustration')
            faContentLikes.setAttribute('class', 'likes fa-content')
            faContentDownloads.setAttribute('class', 'downloads fa-content')
            faContentTime.setAttribute('class', 'time fa-content')

            illustrations.appendChild(illustrationHolder)
            illustrationHolder.appendChild(illustration)
            //illustration.appendChild(illustrationImage)
            illustrationHolder.appendChild(followAlongData)
            followAlongData.appendChild(faContainer)
            faContainer.appendChild(faContentLikes)
            faContainer.appendChild(faContentDownloads)
            faContainer.appendChild(faContentTime)
        } else {
            illustration.setAttribute('class', 'illustration loadBlinking')
            faContentLikes.setAttribute('class', 'likes fa-content loadBlinking')
            faContentDownloads.setAttribute('class', 'downloads fa-content loadBlinking')
            faContentTime.setAttribute('class', 'time fa-content loadBlinking')

            illustrations.appendChild(illustrationHolder)
            illustrationHolder.appendChild(illustration)
            //illustration.appendChild(illustrationImage)
            illustrationHolder.appendChild(followAlongData)
            followAlongData.appendChild(faContainer)
            faContainer.appendChild(faContentLikes)
            faContainer.appendChild(faContentDownloads)
            faContainer.appendChild(faContentTime)
        }
    }

}



class Secondary {
    // Meant to deal with all secondary opperations on data
    constructor(raw) {
        this.data = raw;
    }

    reverseArr() {

        //Pointers. Trying to get O(n) time, O(1) space
        let left = 0;
        console.log(this.data)
        let right = this.data.length - 1

        while (left < right) {
            let temp = this.data[left];
            this.data[left] = this.data[right];
            this.data[right] = temp;

            left++; right--;
        }
        return this.data
    }


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



    if (type == 'Search Results') {
        console.log(rawData)
        childrenArr = rawData.split('(__)')
        if (rawData != null) children = childrenArr.length
        console.log(children)
    }
    window.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            menuID.style.display = 'none'
        }
    })

    if (type == 'Search Results' || type == 'menu') {
        for (i = 0; i < children; i++) {
            var yearProduced = 0
            var downloads = 0
            var views = 0

            results = childrenArr[i].split(" ")
            numbersArr = []
            for (j = 0; j < results.length; j++) {
                if (Number.isInteger(parseInt(results[j]))) { numbersArr[i] = results[j]; console.log(results[j]) }
            };

            console.log(`Year produced: ${numbersArr[numbersArr.length - 4]}`)
            console.log(`time: ${numbersArr[numbersArr.length - 3]} minutes ${numbersArr[numbersArr.length - 2]} seconds`)
            console.log(`views: ${numbersArr[numbersArr.length - 1]}`)
            console.log(`link: http${childrenArr[i].split('http')[1]}`)

            link = `http${childrenArr[i].split('http')[1]}`
            views = `${numbersArr[numbersArr.length - 1]}`



            illustrationHolder = document.createElement('div')
            illustration = document.createElement('div')
            followAlongData = document.createElement('div')
            faContainer = document.createElement('div')
            titleName = document.createElement('div')
            faContentLikes = document.createElement('div')
            faContentDownloads = document.createElement('div')
            faContentTime = document.createElement('div')

            illustrationImage = document.createElement('img')
            illustrationImage.src = randomImages()


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
            illustration.appendChild(illustrationImage)
            illustrationHolder.appendChild(followAlongData)
            followAlongData.appendChild(faContentLikes)
            followAlongData.appendChild(faContentDownloads)
            followAlongData.appendChild(faContentTime)

            //making each element clickable
            illustrationImage.addEventListener('click', (() => {
                console.log(link)
                sendURL(link)
            }))
        }

    }


    //creating elements



}

function randomImages() {
    images = ['./localMedia/1b549836-f457-4f24-94eb-8c4bfced2f14.jpeg', './localMedia/10bfc299-35c6-4d3f-9a9c-743c0424f7e5.jpeg', 'public/localMedia/b89bff30-0139-4d33-ace5-c2af20cdc774.jpeg', './localMedia/c7fc234f-8f18-4835-b600-b9540694b9be.jpeg']
    image = images[Math.random() * (image.length - 1)]
    console.log('image number==>', Math.floor(Math.random() * ((images.length - 1) - 0) + 0))
    return image
}
