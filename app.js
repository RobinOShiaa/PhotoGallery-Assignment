// Album & Photo template with script tag to be dynamically generated using Mustache
const $albumTemplate = document.getElementById('album-template').innerHTML;
const $photosTemplate = document.getElementById('photo-template').innerHTML;
// Main element for all dynamic html elements to be appended onto
const $mainView = document.querySelector('.row');
// Search button
const $searchInput = document.getElementById('search-example');

const $nextPageButton = document.getElementById('next-page');
const $previousPageButton = document.getElementById('previous-page');

const $pages = document.querySelector('.pagination');
const $pageNum = document.getElementById('page_num');


const alb = new Api();
let viewingPhotos = false,
albums_current_page = 1,
photos_current_page = 1,
num_of_totalPages,
data,
rows = 24;


function DisplayList(items,rows_per_page,page) {
  page --;
  let start = rows_per_page * page;
  let end = start + rows_per_page;
  let paginatedItems = items.slice(start, end);
  return paginatedItems;
}

const assemblePageNumbers = (num_of_totalPages) => {
  Array.from($pages.firstElementChild.children).forEach((element) => {
    element.className === 'page' && element.remove();
  })
  for (let i = 1; i <= num_of_totalPages; i++) {
    const html = Mustache.render($pageNum.innerHTML, {
      num : i
    });
    $pages.firstElementChild.insertAdjacentHTML('beforeend',html);
  }
}

const checkButtonsVisible = (pageNum) => {
  pageNum === num_of_totalPages ? $nextPageButton.style = 'display:none;' : $nextPageButton.style= 'display:block;'
  pageNum === 1 ? $previousPageButton.style = 'display:none;' : $previousPageButton.style= 'display:block;'
}

const goToPageNum = (e) => {
  if (!viewingPhotos){
    albums_current_page = +e.target.textContent;
    checkButtonsVisible(albums_current_page)
    paintAlbums(DisplayList(JSON.parse(sessionStorage.getItem('data')),rows,albums_current_page))
    console.log(e.target.textContent);
  } else {
    photos_current_page = +e.target.textContent;
    checkButtonsVisible(photos_current_page)
    paintPhotos(DisplayList(JSON.parse(sessionStorage.getItem('current_photos')),rows,photos_current_page))
    console.log(e.target.textContent);
  }
}

// Event listener on the startup of the webpage
document.addEventListener('DOMContentLoaded', async () => {
  const dataResult = Object.entries(await alb.getAll()).slice(0);
  data = dataResult;
  num_of_totalPages = dataResult.length % rows != 0 ? Number((dataResult.length / rows).toFixed(0)) + 1 : Number(dataResult.length / rows);
  $previousPageButton.style = 'display:none;'

  assemblePageNumbers(num_of_totalPages);
  // store data set inside session storage to be referenced later throughout the code
  sessionStorage.setItem('data',JSON.stringify(dataResult));
  const paginated = DisplayList(dataResult,rows,albums_current_page)
  paintAlbums(paginated);
});
// Event delegation of event elements via root element 
$mainView.addEventListener('click', (e) => {
  switch(e.target.id) {
    case 'view-button' :
      viewingPhotos = true;
      // Retrieve data set
      const dataResult = JSON.parse(sessionStorage.getItem('data'));
      const albumName = e.target.parentElement.previousElementSibling.children[1].textContent;
      sessionStorage.setItem('album',JSON.stringify(albumName));
      const albumID = e.target.nextElementSibling.textContent;
      // Set heading of corresponding photos viewed
      const photos = Object.fromEntries(dataResult)[albumID].content;
      sessionStorage.setItem('current_photos',JSON.stringify(photos));
      num_of_totalPages = photos.length % rows != 0 ? Number((photos.length / rows).toFixed(0)) + 1 : Number(photos.length / rows);
      assemblePageNumbers(num_of_totalPages);
      checkButtonsVisible(photos_current_page)
      paintPhotos(DisplayList(photos,rows,photos_current_page));
      break;

    case 'back-button':
      photos_current_page = 1;
      data = JSON.parse(sessionStorage.getItem('data'));
      num_of_totalPages = data.length % rows != 0 ? Number((data.length / rows).toFixed(0)) + 1 : Number(data.length / rows) + 1;
      assemblePageNumbers(num_of_totalPages);
      paintAlbums(DisplayList(data,rows,albums_current_page));
      viewingPhotos = false;
      break;

    case 'zoom_in':
      let photoTitleElement = e.target.parentElement.parentElement.previousElementSibling;
      let newVal = !eval(e.target.getAttribute('viewed'));
      e.target.setAttribute('viewed',newVal);
      if(newVal) {
        photoTitleElement.style = "opacity:0; display:flex; height: 190px; width: 100%; justify-content: center; align-items: center; padding: 12px; margin: 0; font-size: 16px; font-weight: 600;";
      } else {
        photoTitleElement.style = "opacity:1; display:flex; height: 190px; width: 100%; justify-content: center; align-items: center; padding: 12px; margin: 0; font-size: 16px; font-weight: 600;";
      }
      break;
    case 'download':
      if(confirm(`You are about to leave the website`)) {
        fetchFile(e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.src)
      }
  }
});

const fetchFile = (url) => {
  window.location.assign(url);
}

// Checks the main container for char entries that exist on the page
$searchInput.addEventListener('keyup', (e) => {
  const text = e.target.value.toLowerCase();
  if(!viewingPhotos) {
    data = JSON.parse(sessionStorage.getItem('data'))
    const searchRes = data.filter(elem => elem[1].title.indexOf(text) !== -1 ? elem[1].title : '');
    text === '' ? paintAlbums(DisplayList(data,rows,albums_current_page)) : paintAlbums(searchRes);
    
  } else {
    data = JSON.parse(sessionStorage.getItem('current_photos'))
    const searchRes = data.filter(elem => elem.title.indexOf(text) !== -1 ? elem.title : null);
    text === '' ? paintPhotos(DisplayList(data,rows,photos_current_page)) : paintPhotos(searchRes);
  }
});

$nextPageButton.addEventListener("click", async () => {
  if(viewingPhotos) {
    photos_current_page ++;
    checkButtonsVisible(photos_current_page);
    const paginated = DisplayList(JSON.parse(sessionStorage.getItem('current_photos')),rows,photos_current_page);
    paintPhotos(paginated);
    
  } else {
    albums_current_page ++;
    checkButtonsVisible(albums_current_page);
    const paginated = DisplayList(JSON.parse(sessionStorage.getItem('data')),rows,albums_current_page);
    paintAlbums(paginated);
  }
})

$previousPageButton.addEventListener("click", async () => {
  if(viewingPhotos) {
    photos_current_page --;
    const paginated = DisplayList(JSON.parse(sessionStorage.getItem('current_photos')),rows,photos_current_page);
    checkButtonsVisible(photos_current_page);
    paintPhotos(paginated);
  } else {
    albums_current_page --;
    checkButtonsVisible(albums_current_page);
    const paginated = DisplayList(JSON.parse(sessionStorage.getItem('data')),rows,albums_current_page);
    paintAlbums(paginated);
  }
})


// Using mustache fill in relevant data inside the main view using the album templates
const paintAlbums = (data) => {
  $mainView.innerHTML = '<h1>Albums</h1>';
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
};

// Using mustache fill in relevant data inside the main view using the photo templates

const paintPhotos = (data,albumName) => {
  $mainView.innerHTML = 
  `<div style="display: flex; align-items: center;">
    <i id="back-button" class="medium material-icons cursor arrow" style="color: #212121; width: 60px;">arrow_back</i>
    <h1 style="font-size:32px; margin: 0; text-transform: uppercase;">${JSON.parse(sessionStorage.getItem('album'))}</h1>
  </div>`;
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