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

function getFilmography(imdbid){
  return fetch('https://imdb-api.com/en/API/Posters/k_e1avzlpn/' + imdbid)
  .then(response => response.json())
  .then(json => json)
  .catch(function(error){
});

}

//Changes screen to selected movie detail screen
function displayMoreInfo(imdbid){
  
    var id = $(`#hiddenId-${imdbid}`).text();
    var type = $('#hiddenType').text();
    console.log(id);
    console.log(type); 
    window.location.assign("http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=" + id + "&type=" + type);
  
}

//Consumes API that retrieves actor's details
function getActor(searchId){
    var header = document.getElementById('navigation');
    var color = 'black';

    header.style.backgroundColor = color
    fetch('https://www.myapifilms.com/imdb/idIMDB?idName=' + searchId + '&token=2c3758b2-e002-44a8-bdf1-26db90b157b4&format=json&language=en-us&filmography=1&bornDied=1&starSign=1&uniqueName=1&actorActress=1&actorTrivia=1&actorPhotos=0&actorVideos=0&salary=1&spouses=1&tradeMark=1&fullSize=1&alternateNames=1')
    .then(async function(response){
        var dataJson = await response.json();
        var actorInfo = dataJson.data.names[0];
        var bio = actorInfo.bio;
        
        //Since birth date doesn't have a split character available the string was
        //split character by character and then put together on by one to the required format
        var birthChars = actorInfo.dateOfBirth.split("")
        var y, m, d
        y = birthChars[0] + birthChars[1] + birthChars[2] + birthChars[3] 
        m =  birthChars[4] + birthChars[5]
        d =  birthChars[6] + birthChars[7]
        
        //avoids error due to actor no having salary info
        if(actorInfo.salaries.length > 0){
            var year = actorInfo.salaries[actorInfo.salaries.length - 1].year;
            var salary = actorInfo.salaries[actorInfo.salaries.length - 1].salary;
        }else{
            var year = '-'
            var salary = '-'
        }

        var info = document.getElementById('info')
        var plot = document.getElementById('plot')

        info.style.backgroundColor = color
        plot.style.borderColor = color

        info.innerHTML += `
            <div id="poster" class="col-md-4">
                   <img src=${actorInfo.urlPhoto}/>
            </div>
            <div style="margin-left: 30px" class="col-md-4">
                <div id="header">
                    <h1 style="margin-top: 0px;">
                        <p style="margin-top: 0px;">${actorInfo.name}</p>
                     </h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item"><strong>Birth Name:</strong> ${actorInfo.birthName}</li>
                    <li class="list-group-item"><strong>Birthday:</strong> ${y}-${m}-${d}</li>
                    <li class="list-group-item"><strong>Born in:</strong> ${actorInfo.placeOfBirth}</li>
                    <li class="list-group-item"><strong>Height:</strong> ${actorInfo.height}</li>
                    <li class="list-group-item"><strong>Salary (${year}):</strong> ${salary}</li>
                </ul>
            </div>
            </div>
                `
        plot.innerHTML += `
            <div class="col-md-12" id="bioArea">
                <h2>Bio</h2>
                <p>${bio}</p>
                <button id="readme" class="readmore-btn" onClick=expandBio() style="background-color: ${color};
                border-color: ${color};">Read more</button>
            </div>
                `
                console.log(actorInfo)
        document.getElementById('filmography').innerHTML += `<h2>Filmography</h2>`
        actorInfo.filmographies[0].filmography.forEach(movie => {
            getFilmography(movie.imdbid).then(moviePoster =>
            document.getElementById('filmography').innerHTML += `
            <div class="actorCard" class="col-md-4" style="background-color: #00000052; border: 2px solid ${color};">
                <p id="hiddenId-${movie.imdbid}" hidden>${movie.imdbid}</p>
                <p id="hiddenType" hidden>movie</p>
                <div class="card">
                    <img src=${moviePoster.posters[0].link}/>
                    <div class="card-body">
                    <h5 class="card-header">
                    <a href="http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=${movie.imdbid}&type=movie" style="color: black; text-decoration: none">
                    ${movie.title}
                    </a>
                    </h5>
                </div>
                <div class="card-footer" style="border-top: 1px solid ${color};">
                    <button class="findmore" type="button" class="btn btn-primary" onClick="displayMoreInfo('${movie.imdbid}')" style="background-color: ${color};
                        border-color: ${color};">Find out more</button>
                    </div>
                </div>
            </div>
                `
                ).catch(function(error){
                  console.log(error)
                })

            });
    }).catch(function(error){
        console.log(error);
    })
}


//On page loaded this js is executed
function pageLoaded() {

    //Gets URL endpoint with actor id necessary to execute the API
    var sPageURL = window.location.search.substring(1);
    var sParameterName = sPageURL.split('=');


    if (sParameterName[0] == 'search') {
        var searchId = sParameterName[1];
    }

    getActor(searchId);

}
//Listens to page loaded event
window.addEventListener("load", pageLoaded);