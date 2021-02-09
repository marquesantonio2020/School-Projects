function getInTheaters() {
    comingSoon = document.getElementById('comingsoon');
    var color = '#c00202'
    $.ajax({
      url: 'https://imdb-api.com/en/API/InTheaters/k_e1avzlpn',
      method: 'GET',
      dataType: 'json',
      success: function (response) {
        for(var m of response.items){
            if (m.image !== null || m.plot !== null || m.contentRating !== null) {
            document.getElementById('listing').innerHTML += `
            <div style='border-radius: 20px; border-color: ${color}; border-width: thick;' class='card'>
            <p id="hiddenId-${m.id}" hidden>${m.id}</p>
            <p id="hiddenType" hidden>movie</p>
            <h5 style="border-bottom-color: ${color};" class='card-header'>
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
            <div style="border-top-color: ${color};" class='cardFooter'>
            <button style="float: right; margin-top: 5px; background-color: ${color}; border-color: ${color};" 
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
    }
  
      }, error: function (error) {
        console.log(error);
      }
    })
  
  }
  
  //On page loaded this js is executed
  function pageLoaded() {

    //Coming soon movie
    getInTheaters()

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