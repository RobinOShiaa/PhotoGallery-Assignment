// Album & Photo template with script tag to be dynamically generated using Mustache
const $albumTemplate = document.getElementById('album-template').innerHTML;
const $photosTemplate = document.getElementById('photo-template').innerHTML;
// Main element for all dynamic html elements to be appended inside
const $mainView = document.querySelector('.row');
// Search button
const $filterSearch = document.getElementById('search-example');
// Button to return to albums 
const $backButton = document.getElementsByClassName('back-button');

let viewPhoto = false;
const alb = new Albums();

// Event listener on the startup of the webpage
document.addEventListener('DOMContentLoaded', async () => {
  const dataResult = await alb.getAll();
  // store data set inside session storage to be referenced later throughout the code
  sessionStorage.setItem('data',JSON.stringify(dataResult));
  console.log(JSON.parse(sessionStorage.getItem('data', dataResult)));
  paintAlbums(dataResult);
});

$mainView.addEventListener('click', (e) => {
  switch(e.target.id) {
    case 'view-button' :
      // Retrieve data set
      const dataResult = JSON.parse(sessionStorage.getItem('data'));
      const albumName = e.target.parentElement.previousElementSibling.children[1].textContent;
      const albumID = e.target.nextElementSibling.textContent;
      // Set heading of corresponding photos viewed
      $mainView.innerHTML = 
              `<div style="display: flex; align-items: center;">
                <i id="back-button" class="medium material-icons cursor arrow" style="color: #212121; width: 60px;">arrow_back</i>
                <h1 style="font-size:32px; margin: 0; text-transform: uppercase;">${albumName}</h1>
              </div>`;
      const photos = dataResult[albumID].content;
      paintPhotos(photos);
      break;
    
    case 'back-button':
      paintAlbums(JSON.parse(sessionStorage.getItem('data')));
      viewPhotos = false;
      break;

    case 'zoom_in':
      viewPhoto = !viewPhoto;
      let downloadIcon = e.target.parentElement.previousElementSibling;
      let photoTitleElement = e.target.parentElement.parentElement.previousElementSibling;

      if(viewPhoto) {
        downloadIcon.style = "visibility:hidden;";
        photoTitleElement.style = "opacity:0; display:flex; height: 190px; width: 100%; justify-content: center; align-items: center; padding: 12px; margin: 0; font-size: 16px; font-weight: 600;";
      } else {
        downloadIcon.style = "visibility:initial";
        photoTitleElement.style = "opacity:1; display:flex; height: 190px; width: 100%; justify-content: center; align-items: center; padding: 12px; margin: 0; font-size: 16px; font-weight: 600;";
      }
      break;

    case 'download':
      if(confirm(`You are about to leave website`)) {
        fetchFile(e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.src)
      }
  }

});

const fetchFile = (url) => {
  window.location.assign(url);
}

// Checks the main container for char entries that exist on the page
$filterSearch.addEventListener('keyup', (e) => {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll('.card-title').forEach(title => {
    // (album || photo) name
    const item = title.textContent;
    if(item.toLowerCase().indexOf(text) != -1){
      // show card of photo || album
      title.parentElement.parentElement.style.display = 'block';
    } else {
      // dont show card of photo || album
      title.parentElement.parentElement.style.display = 'none';
    }
  });
});


// Using mustache fill in relevant data inside the main view using the album templates
const paintAlbums = (data) => {
  $mainView.innerHTML = '<h1>Albums</h1>';
  try {
    Object.keys(data).map(id => {
      const html = Mustache.render($albumTemplate, {
        title : data[id].title,
        thumbnailUrl : data[id].content[0].thumbnailUrl,
        id : id
      });
      $mainView.insertAdjacentHTML('beforeend',html) 
    });
  }
  catch(e) {
    throw new Error(e);
  }
};

// Using mustache fill in relevant data inside the main view using the photo templates

const paintPhotos = (data) => {
  try {
    data.forEach(item => {
      const html = Mustache.render($photosTemplate, {
        title : item.title,
        thumbnailUrl : item.thumbnailUrl
      });
      $mainView.insertAdjacentHTML('beforeend',html) 
    })
  }
  catch(e) {
    throw new Error(e);
  }
};