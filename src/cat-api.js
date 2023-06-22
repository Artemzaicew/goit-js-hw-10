const BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY = 'live_mFF0WIN14ONml7fJ88Ckf31ZjBclR95v7XKWEeFCV2BJs0eKZuWQKC82rtHClnd8';

async function fetchBreeds() {
  const url = `${BASE_URL}/breeds`;
  const params = {
    headers: {
      'x-api-key': API_KEY,
    },
  };

  try {
    const response = await fetch(url, params);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data.map(breed => {
      return {
        id: breed.id,
        name: breed.name,
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchCatByBreed(breedId) {
  const url = `${BASE_URL}/images/search?breed_ids=${breedId}`;
  const params = {
    headers: {
      'x-api-key': API_KEY,
    },
  };

  try {
    const response = await fetch(url, params);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (data.length > 0) {
      const cat = data[0];
      const breedInfo = cat.breeds[0];

      return {
        imageUrl: cat.url,
        breed: breedInfo.name,
        description: breedInfo.description,
        temperament: breedInfo.temperament,
      };
    } else {
      throw new Error('Не знайдено кота для вказаної породи.');
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { fetchBreeds, fetchCatByBreed };