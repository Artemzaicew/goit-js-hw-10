const BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY = 'live_mFF0WIN14ONml7fJ88Ckf31ZjBclR95v7XKWEeFCV2BJs0eKZuWQKC82rtHClnd8';

function fetchBreeds() {
  const url = `${BASE_URL}/breeds`;
  const params = {
    headers: {
      'x-api-key': API_KEY,
    },
  };

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}


function fetchCatByBreed(breedId) {
  const url = `${BASE_URL}/images/search`;
  const params = {
    headers: {
      'x-api-key': API_KEY,
    },
  };

  return fetch(`${url}?breed_ids=${breedId}&api_key=${API_KEY}`).then(
    response => {
      if (!response.ok) {
        throw new Error(
          'Не знайдено кота для вказаної породи.',
          response.statusText
        );
      }
      return response.json();
    }
  );
}


export { fetchBreeds, fetchCatByBreed };