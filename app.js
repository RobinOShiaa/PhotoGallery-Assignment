const $albumTemplate = document.getElementById('album-template').innerHTML;
const $mainView = document.querySelector('.row');
const $filterSearch = document.getElementById('search-example');


let viewPhotos = false;
const alb = new Albums();

document.addEventListener('DOMContentLoaded', async (e) => {
  const dataResult = await alb.getAll();
  paint(dataResult);

});


$mainView.addEventListener('click', async (e) => {
  if (e.target.id === 'view-button') {
    viewPhotos = true;
    const name = e.target.parentElement.previousElementSibling.children[1].textContent;
    console.log(name)
    $mainView.innerHTML = '';
    // const dataResult = await alb.getAll();
    // const photos = dataResult
   
      
    // })
    // console.log(photos)

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

const paint = (data) => {
  try {
    Object.keys(data).map(id => {
      const html = Mustache.render($albumTemplate, {
        title : data[id].title,
        thumbnailUrl : data[id].content[0].thumbnailUrl
      });
      $mainView.insertAdjacentHTML('beforeend',html) 
    });
  }
  catch(e) {
    throw new Error(e);
  }
};

