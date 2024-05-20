'use strict'; 
import {musicService} from './music-group-service.js';

const url = "https://appmusicwebapinet8.azurewebsites.net/api";
const _service = new musicService(url);

let _currentPage = 0;
let _maxNrpages = 20;

const albumlist = document.querySelector("#albums");
const btnPrev = document.querySelector("#btnPrev");
const btnNext = document.querySelector("#btnNext");

//Add event listeners
btnPrev.addEventListener("click", clickPrev);
btnNext.addEventListener("click", clickNext);

//Declare event handlers
async function clickPrev (e){

    if (_currentPage > 0 ) {
        _currentPage--;
        await renderAlbums(_currentPage);
    }
}

async function clickNext (e){
    if (_currentPage < _maxNrpages-1) {
        _currentPage++;
        await renderAlbums(_currentPage);
    }
}

//Helpers
async function renderAlbums(currentPage) {

  let data = await _service.readMusicGroupsAsync(currentPage);
  
  while (albumlist.firstElementChild !== null) {
      albumlist.removeChild(albumlist.firstElementChild);
  }

  data.pageItems.forEach(item => {

      const li = document.createElement("li");
      li.innerText = item.name;
      albumlist.appendChild(li);
  });
}

//Page init
(async () => {

    let info = await _service.readInfoAsync();
    console.log(info);

    await renderAlbums(_currentPage);

}) ();



