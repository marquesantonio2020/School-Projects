function getNews(){
    $.ajax({
        url: 'https://newsapi.org/v2/top-headlines?q=movie&apiKey=2334e5c006bf44248dea2485c7b0ef70',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
          for (var article of response.articles) {
            var date = article.publishedAt.replace('T', '|')
            date = date.replace('Z', '')
            var news = `
            <div class="post-preview">
              <a href=${article.url}>
              <h2 class="post-title">
                ${article.title}
              </h2>
              <hr>
              <div id="descriptionImage">
              <h3 class="postSubtitle">
                ${article.description}
              </h3>
              <img src=${article.urlToImage} id="images"/>
              </div>
              <hr>
              </a>
              <p class="post-meta">Posted by
              <a href="#">${article.source.id}</a>
              on ${date}</p>
            </div>
            <hr>`
  
            $('#list').append(news);
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
    getNews()
}
  

//Listens to page loaded event
window.addEventListener("load", pageLoaded);