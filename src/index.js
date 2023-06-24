import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const breedSelectEl = document.querySelector('.breed-select');
const loaderEl = document.querySelector('.loader');
const catInfoEl = document.querySelector('.cat-info');
const errorEl = document.querySelector('.error');

let currentRequestToken = null;

function showLoader() {
  loaderEl.style.display = 'block';
}

function hideLoader() {
  loaderEl.style.display = 'none';
}

function showError() {
  Notify.failure('Виникли якісь проблеми! Спробуйте перезавантажити сторінку!');
}

function hideError() {
  errorEl.style.display = 'none';
}

function clearCatInfo() {
  while (catInfoEl.firstChild) {
    catInfoEl.removeChild(catInfoEl.firstChild);
  }
}

function populateCatInfo(catData) {
  const catDiv = document.createElement('div');
  const imageUrl = catData[0].url;
  const breed = catData[0].breeds[0].name;
  const description = catData[0].breeds[0].description;
  const temperament = catData[0].breeds[0].temperament;
  catDiv.innerHTML = `
    <img src="${imageUrl}" width="500">
    <div>
      <h2>${breed}</h2>
      <p>${description}</p>
      <p><b>Темперамент:</b> ${temperament}</p>
    </div>
  `;
  catInfoEl.appendChild(catDiv);
}

function populateBreedSelect(breeds) {
  const options = breeds.map(breed => ({
    value: breed.id,
    text: breed.name,
  }));

  breedSelectEl.style.display = 'block';
  new SlimSelect({
    select: '.breed-select',
    data: options,
  });
}

async function fetchBreedsList() {
  try {
    const breeds = await fetchBreeds();
    populateBreedSelect(breeds);
  } catch (error) {
    console.log(error);
    hideLoader();
    showError();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  breedSelectEl.style.display = 'none';
  hideLoader();
  hideError();
  fetchBreedsList();
});

breedSelectEl.addEventListener('change', async () => {
  const breedId = breedSelectEl.value;
  showLoader();
  clearCatInfo();

  const requestToken = {};
  currentRequestToken = requestToken;

  try {
    const catData = await fetchCatByBreed(breedId);
    if (requestToken === currentRequestToken) {
      hideLoader();
      populateCatInfo(catData);
    }
  } catch (error) {
    if (requestToken === currentRequestToken) {
      hideLoader();
      showError();
    }
  }
});
