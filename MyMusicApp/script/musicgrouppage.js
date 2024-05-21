'use strict'; 
import {musicService} from './music-group-service.js';

const url = "https://appmusicwebapinet8.azurewebsites.net/api";
const _service = new musicService(url);

let _currentPage = 0;
// let _maxNrpages = 1;
let _maxNrpages = 20;

const albumlist = document.querySelector("#albums");
const btnPrev = document.querySelector("#btnPrev");
const btnNext = document.querySelector("#btnNext");
const btnSearch = document.querySelector("#btnSearch");
const searchInput = document.querySelector("[data-search]");

//Add event listeners
btnPrev.addEventListener("click", clickPrev);
btnNext.addEventListener("click", clickNext);
btnSearch.addEventListener("click", clickSearch);

//Declare event handlers
async function clickPrev (e){

    if (_currentPage > 0 ) {
        _currentPage--;
        await renderAlbums(_currentPage, searchInput.value);
    }
}

async function clickNext (e){
    if (_currentPage < _maxNrpages-1) {
        _currentPage++;
        await renderAlbums(_currentPage, searchInput.value);
    }
}

async function clickSearch(e) {
    _currentPage = 0;
    await renderAlbums(_currentPage, searchInput.value);
}

//Helpers
async function renderAlbums(currentPage, filter = null) {
    let data = await _service.readMusicGroupsAsync(currentPage, false, filter);
  
    while (albumlist.firstElementChild !== null) {
        albumlist.removeChild(albumlist.firstElementChild);
    }

    data.pageItems.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item.name;
        albumlist.appendChild(li);
    });

    // _maxNrPages = Math.ceil(data.totalCount / data.pageSize);
    // console.log('Total Count:', data.totalCount);
    // console.log('Page Size:', data.pageSize);
    // console.log(_maxNrpages);
}

//Page init
(async () => {

    let info = await _service.readInfoAsync();
    console.log(info);

    await renderAlbums(_currentPage);

}) ();



