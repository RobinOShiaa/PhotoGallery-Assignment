const ALBUM_URL =  "https://jsonplaceholder.typicode.com/albums";
const PHOTOS_URL = 'https://jsonplaceholder.typicode.com/photos';

class Albums {
  getAll() {
    return new Promise(async (resolve,reject) => {
      const albResp =  await fetch(ALBUM_URL);
      let albums = await albResp.json();

      const phoResp =  await fetch(PHOTOS_URL);
      const photos = await phoResp.json();

      let dataResult = albums.reduce((acc, curr) => {
        if (acc[curr.id] === undefined) {
          acc[curr.id] = { userId: curr.userId, title: curr.title, content: [] };
        }
        return acc;
      }, {});
      photos.forEach(photo => dataResult[photo.albumId].content.push(photo));
      try {
        resolve(dataResult);
      } catch(error) {
        reject(error)
      }
    }) 
  } 
}