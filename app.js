const $albumTemplate = document.getElementById('album-template').innerHTML;
const $mainView = document.querySelector('.row');
const $filterSearch = document.getElementById('search-example');
const $photosTemplate = document.getElementById('photo-template').innerHTML;
const $nextPage = document.getElementById('next-page');
const $previousPage = document.getElementById('previous-page');

let viewPhoto = false;
let current_page = 1;
let rows = 24;
let end = false;
const alb = new Albums();

function DisplayList(items,rows_per_page,page) {
  items = Object.entries(items).slice(0)
  page --;
  let start = rows_per_page * page;
  let end = start + rows_per_page;
  let paginatedItems = items.slice(start, end);
  return paginatedItems;
  
}

document.addEventListener('DOMContentLoaded', async (e) => {
  const dataResult = await alb.getAll();
  const paginated = DisplayList(dataResult,rows,current_page)

  paintAlbums(paginated);
  
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
      paintAlbums(DisplayList(dataResult,rows,current_page));
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

$nextPage.addEventListener("click", async () => {
    if (!end) {
      const dataResult = await alb.getAll();
      current_page++;
      paintAlbums(DisplayList(dataResult,rows,current_page));
    }
  
  
})

$previousPage.addEventListener("click", async () => {
    if (current_page > 1) {
      if (end) {
        end = false;
      }
      const dataResult = await alb.getAll();
      current_page--;
      paintAlbums(DisplayList(dataResult,rows,current_page));
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
  $mainView.innerHTML = '<h1>Albums</h1>';
  if(data.length === 0) {
    $mainView.insertAdjacentHTML('beforeend','<h2>No content</h2>')
    end = true;
  } else {
      try {
        data.map(id => {
          const html = Mustache.render($albumTemplate, {
            title : id[1].title,
            thumbnailUrl : id[1].content[0].thumbnailUrl,
            id : id[0]
          });
          $mainView.insertAdjacentHTML('beforeend',html) 
        });
      }
      catch(e) {
        throw new Error(e);
      }

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