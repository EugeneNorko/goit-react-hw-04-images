const API_KEY = '27534046-6fc4d325b3f92bd0fdc000195';

export function fetchImages(value, page) {
  return fetch(
    `https://pixabay.com/api/?q=${value}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  ).then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(new Error('Something did go wrong'));
  });
}

export function fetchPopularImages() {
  return fetch(
    `https://pixabay.com/api/?page=1&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  ).then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(new Error('Something did go wrong'));
  });
}
