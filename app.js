const $albumTemplate = document.getElementById('album-template').innerHTML;
const $mainView = document.querySelector('.row');
const $filterSearch = document.getElementById('search-example');
const $photosTemplate = document.getElementById('photo-template').innerHTML;

let viewPhotos = false;
const alb = new Albums();

document.addEventListener('DOMContentLoaded', async (e) => {
  const dataResult = await alb.getAll();
  paintAlbums(dataResult);

});


$mainView.addEventListener('click', async (e) => {
  if (e.target.id === 'view-button') {
    viewPhotos = true;
    const albumName = e.target.parentElement.previousElementSibling.children[1].textContent;
    const albumID = e.target.nextElementSibling.textContent;
    console.log(albumID);
    $mainView.innerHTML = `<h1>Photos from: ${albumName}</h1>`;
    const dataResult = await alb.getAll();
    const photos = dataResult[albumID].content;
    paintPhotos(photos);

  }

})


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
