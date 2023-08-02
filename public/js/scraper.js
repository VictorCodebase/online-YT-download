var osmosis = require('osmosis');

//var url = 'https://open.spotify.com/playlist/5WscasInXtVVwMIRf08rZV?si=10636e3821674abf'
var url = 'https://www.youtube.com/results?search_query=theater'

var metadata = []

osmosis
    .get(url)

    .find('/html/body/ytd-app/div[1]/div/ytd-masthead/div[4]/div[2]/ytd-searchbox/form/div[1]/div[1]/input')

    .set('name')

    .data(function(data){
        metadata.push(data.name);
    })

    .error(console.log)

    .done(function(){
        console.log(metadata)
    })