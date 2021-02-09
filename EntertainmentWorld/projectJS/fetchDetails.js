//Allows read more button to expand or collapse
function expandBio() {
    //Reference: https://www.youtube.com/watch?v=uI18xGocVnw
    var readmore = document.getElementById("readme")
    var bioArea = document.getElementById("bioArea")
  
    bioArea.classList.toggle("showContent") 
  
    //Shorthand if-else statement
    var replaceText = bioArea.classList.contains("showContent") ? "Read Less" : "Read More";
    readmore.innerText = replaceText
    }

//Changes screen to actor details
function actorMoreDetails(idActor){
    var id = idActor
    console.log(id)
    window.location.assign("http://localhost:81/SIR2020_2021/EntertainmentWorld/actorMoreDetails.html?search=" + id);
}

//Consumes API that retrieves details about the select item
function getItemDetails(id, type) {
    var header = document.getElementById('navigation');
    //Depending on the type of item their color changes
    var color;
    

    if (type === 'anime') {
        color = 'blue'
        header.style.backgroundColor = color
        $.ajax({
            url: 'https://kitsu.io/api/edge/anime?filter[id]=' + id,
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                var anime = response.data[0].attributes;
                var info = document.getElementById('info')
                var plot = document.getElementById('plot')

                info.style.backgroundColor = color
                plot.style.borderColor = color
                info.innerHTML += `
                <div id="poster" class="col-md-4">
                    <img src=${anime.posterImage.small} />
                </div>
                <div style="margin-left: 30px" class="col-md-4 items">
                    <div id="header">
                    <h1 style="margin-top: 0px;">
                    <p style="margin-top: 0px;">${anime.canonicalTitle}</p>
                    <p style="margin-top: 0px;">${anime.titles.ja_jp}</p>
                    </h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item"><strong>Genre:</strong> ${anime.showType}</li>
                    <li class="list-group-item"><strong>Start:</strong> ${anime.startDate}</li>
                    <li class="list-group-item"><strong>End:</strong> ${anime.endDate}</li>
                    <li class="list-group-item"><strong>Rated:</strong> ${anime.ageRating}</li>
                    <li class="list-group-item"><strong>IMDB Rating:</strong> ${anime.ratingRank}</li>
                </ul>
                `

                plot.innerHTML += `
                <div class="col-md-12" style="height: auto;">
                   <h2>Plot</h2>
                   <p>${anime.synopsis}</p>
                </div>
                `
                //iFrame allows to place a video on its area
                document.getElementById('trailer').innerHTML = `
                <div class="col-md-4">
                    <iframe width="1089.2px" height="600px" src="https://www.youtube.com/embed/${anime.youtubeVideoId}?autoplay=1&mute=1&controls=1">
                    </iframe>
                </div>
                `
                
            },
            error: function (error) {
                console.log(error);
            }
        })
    } else {
        if(type === 'movie'){
            color = 'coral'
            var colorAlpha = '#ff7f5052'
        }else{
            color = 'green';
            var colorAlpha = '#00800052'
        }
        header.style.backgroundColor = color
        $.ajax({
            url: 'https://imdb-api.com/en/API/Title/k_e1avzlpn/' + id + '/Wikipedia,',
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                console.log(response)
                var result = response;
                var plotText = result.wikipedia.plotFull.plainText;

                var info = document.getElementById('info')
                var plot = document.getElementById('plot')

                info.style.backgroundColor = color
                plot.style.borderColor = color

                info.innerHTML += `
                <div id="poster" class="col-md-4">
                    <img src=${result.image}/>
                </div>
                <div style="margin-left: 30px" class="col-md-4 items">
                    <div id="header">
                        <h1 style="margin-top: 0px;">
                        <p style="margin-top: 0px;">${result.fullTitle}</p>
                        </h1>
                    </div>
                    <ul class="list-group">
                        <li class="list-group-item"><strong>Genre:</strong> ${result.genres}</li>
                        <li class="list-group-item"><strong>Released:</strong> ${result.releaseDate}</li>
                        <li class="list-group-item"><strong>Duration:</strong> ${result.runtimeStr}</li>
                        <li class="list-group-item"><strong>Rated:</strong> ${result.contentRating}</li>
                        <li class="list-group-item"><strong>IMDB Rating:</strong> ${result.imDbRating}</li>
                        <li class="list-group-item"><strong>Director:</strong> ${result.directors}</li>
                        <li class="list-group-item"><strong>Writer:</strong> ${result.writers}</li>
                    </ul>
                </div>
                </div>
                `
                plot.innerHTML += `
                <div class="col-md-12" id="bioArea">
                   <h2>Plot</h2>
                   <p>${plotText}</p>
                   <button id="readme" class="readmore-btn" onClick=expandBio() style="background-color: ${color};
                   border-color: ${color};">Read more</button>
                </div>
                `
                $.ajax({
                    url: 'https://imdb-api.com/en/API/YouTubeTrailer/k_e1avzlpn/' + id,
                    method: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        document.getElementById('trailer').innerHTML = `
                        <h2>Trailer</h2>
                        <div class="col-md-4">
                            <iframe width="1089.2px" height="600px" src="https://www.youtube.com/embed/${response.videoId}?autoplay=1&mute=1&controls=1">
                            </iframe>
                        </div>
                `
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
                

                document.getElementById('actorList').innerHTML += `<h2>Cast</h2>`
                result.actorList.forEach(actor => {
                document.getElementById('actorList').innerHTML += `
                <div class="actorCard" class="col-md-4" style="background-color: ${colorAlpha}; border: 2px solid ${color};">
                <p id="idActor-${actor.id}" hidden>${actor.id}</p>
                    <div class="card">
                        <img src=${actor.image}/>
                        <div class="card-body">
                        <h5 class="card-header">
                        <a href="http://localhost:81/SIR2020_2021/EntertainmentWorld/actorMoreDetails.html?search=${actor.id}" style="color: black;text-decoration: none">
                        ${actor.name} as ${actor.asCharacter}
                        </a>
                        </h5>
                        </div>
                        <div class="card-footer" style="border-top: 1px solid ${color};">
                            <button class="findmore btn btn-primary" type='button' onClick="actorMoreDetails('${actor.id}')" style="background-color: ${color};
                            border-color: ${color};">Find more</button>
                        </div>
                    </div>
                </div>
                `
                
                });
                
            },
            error: function (error) {
                console.log(error);
            }
        })

    }
}
//On page loaded this js is executed
function pageLoaded() {

    //Gets URL endpoint with information about selected item
    var sPageURL = window.location.search.substring(1);
    
    var sParameter = sPageURL.split('&');
    var sParameterId = sParameter[0].split('=');
    var sParameterType = sParameter[1].split('=');

    if (sParameterId[0] == 'search' && sParameterType[0] == 'type') {
        var id = sParameterId[1];
        var type = sParameterType[1];
    }

    getItemDetails(id, type);


}

//Listens to page loaded event
window.addEventListener("load", pageLoaded);