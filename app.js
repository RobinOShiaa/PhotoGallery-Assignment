const $albumTemplate = document.getElementById('album-template').innerHTML;
const $mainView = document.querySelector('.row');


const setUp = async () => {
  const alb = new Albums();
  const result = await alb.getAll();
  Object.keys(result).map(id => {
    const html = Mustache.render($albumTemplate, {
      title : result[id].title,
      thumbnailUrl : result[id].content[0].thumbnailUrl
    });
    $mainView.insertAdjacentHTML('beforeend',html) 
  });
  
  console.log(JSON.stringify (result, null, " "));
  // Object.keys(result).forEach(item => localStorage.setItem('photos',JSON.stringify(result[item].content)));
};

setUp();


