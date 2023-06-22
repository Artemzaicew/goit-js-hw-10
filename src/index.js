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

function populateBreedSelect(breeds) {
  breeds.forEach(breed => {
    let option = document.createElement('option');
    option.value = breed.id;
    option.innerHTML = breed.name;
    breedSelectEl.appendChild(option);
  });

  breedSelectEl.style.display = 'block';
  new SlimSelect({
    select: '.breed-select',
  });
}

async function fetchBreedsList() {
  try {
    const breeds = await fetchBreeds();
    populateBreedSelect(breeds);
  } catch {
    hideLoader();
    showError();
    hideError();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  breedSelectEl.style.display = 'none';
  hideLoader();
  hideError();
  fetchBreedsList();

  breedSelectEl.addEventListener('change', async () => {
    const breedId = breedSelectEl.value;
    showLoader();
    clearCatInfo();
    
    const requestToken = {};
    currentRequestToken = requestToken;

    try {
      const cat = await fetchCatByBreed(breedId);
      if (requestToken === currentRequestToken) {
        hideLoader();
        cat.html = `
            <img src="${cat.imageUrl}" width="500">  
            <div>
                <h2>${cat.breed}</h2>
                <p>${cat.description}</p>
                <p><b>Темперамент:</b> ${cat.temperament}</p>
            </div>      
        `;
        catInfoEl.insertAdjacentHTML('afterbegin', cat.html);
      }
    } catch {
      if (requestToken === currentRequestToken) {
        hideLoader();
        showError();
      }
    }
  });
});