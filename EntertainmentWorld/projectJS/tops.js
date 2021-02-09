function getTopMovies(){
    $.ajax({
        url: 'https://imdb-api.com/en/API/MostPopularMovies/k_e1avzlpn',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
          for (var popular of response.items) {
            var color;
            if (parseInt(popular.rankUpDown) > 0) {
              color = "green";
            } else if (parseInt(popular.rankUpDown) < 0) {
              color = "red";
            } else {
              color = "yellow";
            }
            var movieCard = `
              <div class="card">
                <div class="card-image">
                  <img src="${popular.image}">
                </div>
                <div class="card-content">
                  <span class="card-title" style="height: 20%">
                    <a href="http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=${popular.id}&type=movie" style="color: black;">${popular.fullTitle}</a>
                  </span>
                  <hr>
                  <p>Rank: ${popular.rank}</p>
                  <p style="color: ${color}">Previous Rank: ${popular.rankUpDown}</p><br>
                  <p>Crew: ${popular.crew}</p>
                </div>
                <div class="card-action">
                  <a href="http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=${popular.id}&type=movie" style="color: coral;">Find out more</a>
                </div>
              </div>
                  `
            $('#movieDisplay').append(movieCard);
          }
  
  
        },
        error: function (error) {
          console.log(error);
        }
      })
}
function getTopSeries(){
    $.ajax({
        url: 'https://imdb-api.com/en/API/MostPopularTVs/k_e1avzlpn',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
          for (var popular of response.items) {
            var color;
            if (parseInt(popular.rankUpDown) > 0) {
              color = "green";
            } else if (parseInt(popular.rankUpDown) < 0) {
              color = "red";
            } else {
              color = "yellow";
            }
            var tvCard = `
              <div class="card">
                <div class="card-image">
                  <img src="${popular.image}">
                </div>
                <div class="card-content">
                  <span class="card-title" style="height: 20%">
                    <a href="http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=${popular.id}&type=series" style="color: black;">${popular.fullTitle}</a>
                  </span>
                  <hr>
                  <p>Rank: ${popular.rank}</p>
                  <p style="color: ${color}">Previous Rank: ${popular.rankUpDown}</p><br>
                  <p>Crew: ${popular.crew}</p>
                </div>
                <div class="card-action">
                  <a href="http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=${popular.id}&type=series" style="color: coral;">Find out more</a>
                </div>
              </div>
                  `
            $('#tvDisplay').append(tvCard);
          }
  
  
        },
        error: function (error) {
          console.log(error);
        }
      })
}
function getTopAnime(){
    $.ajax({
        url: 'https://api.jikan.moe/v3/top/anime',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
          console.log(response)
          for (var popular of response.top) {
            var color;
            if (popular.score > 5.99) {
              color = "green";
            } else if (popular.score < 5.0) {
              color = "red";
            } else {
              color = "yellow";
            }
  
            var animeCard = `
              <div class="card">
                <div class="card-image">
                  <img src="${popular.image_url}">
                </div>
                <div class="card-content">
                  <span class="card-title" style="height: 20%">
                    <a href="http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=${popular.id}&type=anime" style="color: black;">${popular.title}</a>
                  </span>
                  <hr>
                  <p>${popular.start_date}</p></br>
                  <p>Type: ${popular.type}<p><br>
                  <p>Nº of episodes: ${popular.episodes}<p>
                  <p style="color: ${color}">Rating: ${popular.score}</p> 
                </div>
                <div class="card-action">
                  <a href="http://localhost:81/SIR2020_2021/EntertainmentWorld/moreDetails.html?search=${popular.id}&type=anime" style="color: coral;">Find out more</a>
                </div>
              </div>
                  `
            $('#animeDisplay').append(animeCard);
          }
  
  
        },
        error: function (error) {
          console.log(error);
        }
      })
    

}

//On page loaded this js is executed
function pageLoaded() {
  
    //for each search these three functions are executed
    getTopMovies()
    getTopSeries()
    getTopAnime()
}
  

//Listens to page loaded event
window.addEventListener("load", pageLoaded);
