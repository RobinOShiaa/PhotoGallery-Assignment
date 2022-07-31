const $albumTemplate = document.getElementById('album-template').innerHTML;
const $mainView = document.querySelector('.row');
const $filterSearch = document.getElementById('search-example');
const $photosTemplate = document.getElementById('photo-template').innerHTML;
const $backButton = document.getElementsByClassName('back-button');

let viewPhoto = false;
const alb = new Albums();


document.addEventListener('DOMContentLoaded', async (e) => {
  const dataResult = await alb.getAll();
  paintAlbums(dataResult);

});



$mainView.addEventListener('click', async (e) => {
  const dataResult = await alb.getAll();
  switch(e.target.id) {
    case 'view-button' :
      const albumName = e.target.parentElement.previousElementSibling.children[1].textContent;
      const albumID = e.target.nextElementSibling.textContent;
      $mainView.innerHTML = 
              `<div style="display: flex; align-items: center;">
                <i id="back-button" class="medium material-icons cursor arrow" style="color: #212121; width: 60px;">arrow_back</i>
                <h1 style="font-size:32px; margin: 0; text-transform: uppercase;">${albumName}</h1>
              </div>`;
      const photos = dataResult[albumID].content;
      paintPhotos(photos);
      break;
    
    case 'back-button':
      paintAlbums(dataResult);
      viewPhotos = false;
      break;

    case 'zoom_in':
      viewPhoto = !viewPhoto;
      let downloadIcon = e.target.parentElement.previousElementSibling;
      let photoTitleElement = e.target.parentElement.parentElement.previousElementSibling
      const emptyTitle = "";
      let photoTitle = e.target.parentElement.parentElement.previousElementSibling.textContent;

      if(viewPhoto) {
        downloadIcon.style = "visibility:hidden;";
        photoTitleElement.style = "opacity:0; display:flex; height: 190px; width: 100%; justify-content: center; align-items: center; padding: 12px; margin: 0; font-size: 16px; font-weight: 600;";
      } else {
        downloadIcon.style = "visibility:initial";
        photoTitleElement.style = "opacity:1; display:flex; height: 190px; width: 100%; justify-content: center; align-items: center; padding: 12px; margin: 0; font-size: 16px; font-weight: 600;";
      }
      
      
      break;


  }

});



$filterSearch.addEventListener('keyup', (e) => {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll('.card-title').forEach(title => {
    const item = title.textContent;
    if(item.toLowerCase().indexOf(text) != -1){
      title.parentElement.parentElement.style.display = 'block';
    } else {
      title.parentElement.parentElement.style.display = 'none';
    }
  });
});

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