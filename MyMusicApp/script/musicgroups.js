'use strict'; 
import {musicService} from './music-group-service.js';

const url = "https://appmusicwebapinet8.azurewebsites.net/api";
const _service = new musicService(url);

let _currentPage = 0;
let _maxNrPages = 1;

const albumlist = document.querySelector("#albums");
const btnPrev = document.querySelector("#btnPrev");
const btnNext = document.querySelector("#btnNext");
const btnSearch = document.querySelector("#btnSearch");
const searchInput = document.querySelector("[data-search]");
const favDialog = document.getElementById('favDialog');
const dialogForm = document.getElementById('dialogForm')

//Add event listeners
btnPrev.addEventListener("click", clickPrev);
btnNext.addEventListener("click", clickNext);
btnSearch.addEventListener("click", clickSearch);

//Declare event handlers
async function clickGroup(albumId) {
    //let musicGroupData = await fetchMusicGroup(albumId);
    let musicGroupData = await _service.readMusicGroupAsync(albumId, false);

    // Clear the dialog content
    while (dialogForm.firstElementChild !== null) {
        dialogForm.removeChild(dialogForm.firstElementChild);
    }

    // Populate the dialog with new content
    const bandNameElement = document.createElement('p');
    bandNameElement.innerHTML = `Band Name: ${musicGroupData.name}`;
    dialogForm.appendChild(bandNameElement);

    const genreElement = document.createElement('p');
    genreElement.innerHTML = `Genre: ${musicGroupData.strGenre}`;
    dialogForm.appendChild(genreElement);

    const establishedElement = document.createElement('p');
    establishedElement.innerHTML = `Established: ${musicGroupData.establishedYear}`;
    dialogForm.appendChild(establishedElement);

    const bandMemberAmountElement = document.createElement('p');
    bandMemberAmountElement.innerHTML = `Bandmember Amount: ${musicGroupData.artists.length}`;
    dialogForm.appendChild(bandMemberAmountElement);

    const albumAmountElement = document.createElement('p');
    albumAmountElement.innerHTML = `Album Amount: ${musicGroupData.albums.length}`;
    dialogForm.appendChild(albumAmountElement);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'Close';
    closeButton.setAttribute('type', 'button');
    closeButton.addEventListener('click', () => favDialog.close());
    dialogForm.appendChild(closeButton);

    favDialog.showModal();
  }

async function clickPrev (e){

    if (_currentPage > 0 ) {
        _currentPage--;
        await renderAlbums(_currentPage, searchInput.value);
    }
}

async function clickNext (e){
    if (_currentPage < _maxNrPages-1) {
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
        addRow(item.name, item.musicGroupId)
    });

    _maxNrPages = data.pageCount;
}

async function fetchMusicGroup(id) {
    let musicGroupData = await _service.readMusicGroupAsync(id, true);
    console.log(musicGroupData);
}

function addRow(albumTitle, albumId) {

    // trFluidRow
    let divRow = document.createElement(`div`);
    divRow.classList.add("trFluid");

    // trFluid_Grouping2
    let divGroup2 = document.createElement(`div`);
    divGroup2.classList.add("trFluid_Grouping2");
    divRow.appendChild(divGroup2);

    // divGroup1_1 
    let divGroup1_1 = document.createElement(`div`);
    divGroup1_1.classList.add("trFluid_Grouping1");

    // divGroup1_2
    let divGroup1_2 = document.createElement(`div`);
    divGroup1_2.classList.add("trFluid_Grouping1");

    divGroup2.appendChild(divGroup1_1);
    divGroup2.appendChild(divGroup1_2);

    // tdFluent1
    let divFluent1 = document.createElement(`div`);
    divFluent1.classList.add("tdFluent");
    divFluent1.innerHTML = albumTitle;    

    // tdFluent2
    let divFluent2 = document.createElement(`div`);
    divFluent2.classList.add("tdFluent");

    // tdFluent2 Button
    let divFluent2Button = document.createElement("button");
    divFluent2Button.dataset.itemId = albumId;
    divFluent2Button.addEventListener('click', () => clickGroup(albumId));
    divFluent2Button.innerHTML = "Details";

    divFluent2.appendChild(divFluent2Button);
    divGroup1_1.appendChild(divFluent1);
    divGroup1_2.appendChild(divFluent2);

    albumlist.appendChild(divRow);
}

//Page init
(async () => {

    let info = await _service.readInfoAsync();
    console.log(info);

    await renderAlbums(_currentPage);

}) ();



