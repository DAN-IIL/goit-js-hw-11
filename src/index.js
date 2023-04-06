import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import { fetchImg } from './js/axios';
import { createCards } from './js/colection-card';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('input');
const galleryEl = document.querySelector('.gallery');
const btnLoadMoreEl = document.querySelector('.load-more');

const baseUrl = 'https://pixabay.com/api/';
const key = '35075194-607fd68214bce923c67f35644';
const baseData ='image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
let page = 1;
let query = null;
let simplelightbox = null;

formEl.addEventListener('submit', handleSubmit);
galleryEl.addEventListener('click', onElementOfGalleryClick);
btnLoadMoreEl.addEventListener('click', onBtnLoadMoreClick);

btnLoadMoreEl.classList.add('visually-hidden');

function handleSubmit(event) {
  event.preventDefault();
  query = inputEl.value.trim();
  page = 1;
  console.log(query);
  if (query === '') {
    return Notiflix.Notify.failure(
          'Please, fill in the search field'
        );
  }
  fetchImg(`${baseUrl}?key=${key}&q=${query}&${baseData}&page=${page}`)
    .then(data => {
      if (data.total === 0) {
        inputEl.value = '';
        galleryEl.innerHTML = '';
        btnLoadMoreEl.classList.add('visually-hidden');
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      galleryEl.innerHTML = createCards(data.hits);
      simplelightbox = new SimpleLightbox('.gallery a');
      page += 1;

      if (data.total > 40) {
        btnLoadMoreEl.classList.remove('visually-hidden');
      }
    })
    .catch(console.warn);
}

function onBtnLoadMoreClick() {
  fetchImg(`${baseUrl}?key=${key}&q=${query}&${baseData}&page=${page}`)
    .then(data => {
      galleryEl.insertAdjacentHTML('beforeend', createCards(data.hits));
      simplelightbox.refresh();
      page += 1;
      if (data.hits.length < 40 || Number.parseInt(data.totalHits / 40) === page) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        btnLoadMoreEl.classList.add('visually-hidden');
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function onElementOfGalleryClick(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
}