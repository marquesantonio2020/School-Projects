//Consumes API that gets movies by the title
function getMovie(searchType) {
  $.ajax({
    url: 'https://imdb-api.com/en/API/SearchMovie/k_e1avzlpn/' + searchType,
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      for (var movieResult of response.results) {
        var movieID = movieResult.id;
        $.ajax({
          url: 'https://imdb-api.com/en/API/Title/k_e1avzlpn/' + movieID + '/Wikipedia,',
          method: 'GET',
          dataType: 'json',
          success: function (response) {
            var m = response;
            if (m.image !== null || m.plot !== null || m.contentRating !== null) {
              document.getElementById('listing').innerHTML += `
              <div style='border-radius: 20px; border-color: coral; border-width: thick;' class='card'>
              <p id="hiddenId-${m.id}" hidden>${m.id}</p>
              <p id="hiddenType" hidden>movie</p>
              <h5 style="border-bottom-color: coral;" class='card-header'>
                    <a style="color: black;" href="http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=${m.id}&type=movie"> ${m.fullTitle}</a>
                    <p style="float: right !important;">
                    ${m.type}
                      </p>
              </h5>
              
              <div class="row" style="padding: 10px 25px 10px 25px;">
                <p class="card-text" style="
                display: flex !important;
                font-size: larger !important;
                width: 60%;
                height: 354px;
                overflow: hidden;
                ">
                ${m.plot}
                </p>
                <img class="movieImg" src='${m.image}' style="float: right;align-content: end;">
              </div>
              <div style="border-top-color: coral;" class='cardFooter'>
              <button style="float: right; margin-top: 5px; background-color: coral; border-color: coral;" 
              type="button" class="btn btn-primary" onClick="displayMoreInfo('${m.id}', 'movie')">Find out more</button>
              <p>
              Language: ${m.languages}
             </p><br>
                  <p>
                    Rated: ${m.contentRating}
                  </p><br>
                  <p>
                    Duration: ${m.runtimeStr}
                  </p><br>
                `
            }
          },
          error: function (error) {
            console.log(error);
          }
        })
      }

    },
    error: function (error) {
      console.log(error);
    }

  })

}

//Consumes API that gets series by the title
function getSeries(searchType) {
  $.ajax({
    url: 'https://imdb-api.com/en/API/SearchSeries/k_e1avzlpn/' + searchType,
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      for (var movieResult of response.results) {
        var seriesID = movieResult.id;
        $.ajax({
          url: 'https://imdb-api.com/en/API/Title/k_e1avzlpn/' + seriesID + '/Wikipedia,',
          method: 'GET',
          dataType: 'json',
          success: function (response) {
            var m = response
            if (m.image !== null || m.plot !== null || m.contentRating !== null) {
              document.getElementById('listing').innerHTML += `
              <div style='border-radius: 20px; border-color: green; border-width: thick;' class='card'>
              <p id="hiddenId-${m.id}" hidden>${m.id}</p>
              <p id="hiddenType" hidden>series</p>
              <h5 style="border-bottom-color: green;" class='card-header'>
                    <a style="color: black;" href="http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=${m.id}&type=series"> ${m.fullTitle}</a>
                    <p style="float: right !important;">
                    ${m.type}
                      </p>
              </h5>
              
              <div class="row" style="padding: 10px 25px 10px 25px;">
        <p class="card-text" style="
                display: flex !important;
                font-size: larger !important;
                width: 60%;
                height: 354px;
                overflow: hidden;
                ">
                ${m.plot}
                </p>
                <img class="movieImg" src='${m.image}' style="float: right;align-content: end;">
              </div>
              <div style="border-top-color: green;" class='cardFooter'>
              <button style="float: right; margin-top: 5px; background-color: green; border-color: green;" 
              type="button" class="btn btn-primary" onClick="displayMoreInfo('${m.id}', 'series')">Find out more</button>
              <p>
              Language: ${m.languages}
             </p><br>
                  <p>
                    Rated: ${m.contentRating}
                  </p><br>
                  <p>
                    Duration: ${m.runtimeStr}
                  </p><br>                    
                `
            }
          },
          error: function (error) {
            console.log(error);
          }
        })
      }
    },
    error: function (error) {
      console.log(error);
    }

  })

}
//Consumes API that gets anime by the title
function getAnime(searchType) {
  $.ajax({
    url: 'https://kitsu.io/api/edge/anime?filter[text]=' + searchType,
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      for (var data of response.data) {
        var anime = data.attributes

        document.getElementById('listing').innerHTML += `
          <div style='border-radius: 20px; border-color: blue; border-width: thick;' class='card'>
          <p id="hiddenId-${data.id}" hidden>${data.id}</p>
          <p id="hiddenType" hidden>anime</p>
          <h5 style="border-bottom-color: blue;" class='card-header'>
                <a style="color: black;" href="http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=${data.id}&type=anime"> ${anime.canonicalTitle}</a>
                <p style="float: right !important;">
                    ${anime.showType}
                  </p>
                  <p margin-bottom: 0px !important;>${anime.titles.ja_jp}</p>
          </h5>
          
          <div class="row" style="padding: 10px 25px 10px 25px;">
    <p class="card-text" style="
            display: flex !important;
            font-size: larger !important;
            width: 60%; 
            height: 354px;
            overflow: hidden;
            ">
              ${anime.synopsis}
            </p>
            <img class="movieImg" src='${anime.posterImage.original}' style="float: right;align-content: end;">
          </div>
          <div style="border-top-color: blue;" class='cardFooter'>
          <button style="float: right; margin-top: 5px; background-color: blue; border-color: blue; border-radius: 10px !important;" 
          type="button" class="btn btn-primary" onClick="displayMoreInfo('${data.id}', 'anime')">Find out more</button>
          <p>
          Rated: ${anime.ageRating}
         </p><br>
              <p>
                Episodes: ${anime.episodeCount}
              </p>
              <p style="margin-left: 20px;">
                Score: ${anime.ratingRank}
              </p><br>
              <p>
              Start: ${anime.startDate} End: ${anime.endDate}</p><br>
            
        `
      }
    },
    error: function (error) {
      console.log(error);
    }
  })
}

function getComingSoon(){
  $.ajax({
    url: 'https://imdb-api.com/en/API/ComingSoon/k_e1avzlpn',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      var comingSoon = response.items

      var poster = document.getElementById('poster')
      var randomImage = Math.floor(Math.random()*(comingSoon.length-1)) + 1

      poster.style.backgroundImage = `url(${comingSoon[randomImage].image})`
    }, error: function (error) {
      console.log(error);
    }
  })
}

//On page loaded this js is executed
function pageLoaded() {

  //Gets URL endpoint to get the search of the user
  var sPageURL = window.location.search.substring(1);
  var sParameterName = sPageURL.split('=');


  if (sParameterName[0] == 'search') {
    var searchType = sParameterName[1];
  }

  getComingSoon()

  //for each search these three functions are executed
  getMovie(searchType);
  getSeries(searchType);
  getAnime(searchType);
}

//Changes screen when find more button is pressed using the id and type of the item selected
function displayMoreInfo(selectedId, selectedType) {
  var id = selectedId
  var type = selectedType
  console.log(id);
  console.log(type);
  window.location.assign("http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=" + id + "&type=" + type);
}

//Listens to page loaded event
window.addEventListener("load", pageLoaded);