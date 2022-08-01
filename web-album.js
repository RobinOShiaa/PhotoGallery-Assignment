const ALBUM_URL =  "https://jsonplaceholder.typicode.com/albums";
const PHOTOS_URL = 'https://jsonplaceholder.typicode.com/photos';

class Albums {
  // Retrieve all relevant JSON from photos and albums and formulate it an entire data set using an Object with albumId : [photos]
  getAll() {
    return new Promise(async (resolve,reject) => {
      //fetch request to album url
      const albResp =  await fetch(ALBUM_URL);
      let albums = await albResp.json();

      //fetch request to photo url
      const phoResp =  await fetch(PHOTOS_URL);
      const photos = await phoResp.json();

      // Create object of data set
      let dataResult = albums.reduce((acc, curr) => {
        if (acc[curr.id] === undefined) {
          acc[curr.id] = { userId: curr.userId, title: curr.title, content: [] };
        }
        return acc;
      }, {});

      // fill in data set with photos
      photos.forEach(photo => dataResult[photo.albumId].content.push(photo));
      try {
        resolve(dataResult);
      } catch(error) {
        reject(error)
      }
    }) 
  } 
}