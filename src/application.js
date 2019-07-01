import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import isURL from 'validator/lib/isURL';

export default () => {
  const state = {
    formStatus: 'empty',
    feedsURL: [],
    currentURL: null,
  };

  const input = document.querySelector('#addUrl');
  const inputStatus = document.querySelector('#inputStatus');
  const submitButton = document.querySelector('#submitButton');
  const inputForm = document.querySelector('#inputForm');
  const feedsPart = document.querySelector('#feeds');
  const articlesPart = document.querySelector('#articles');
  const cors = 'https://cors-anywhere.herokuapp.com/';

  const formStatusActions = {
    empty: () => {
      input.value = '';
      submitButton.disabled = true;
      input.classList.remove('is-valid', 'is-invalid');
      inputStatus.textContent = '';
    },
    valid: () => {
      submitButton.disabled = false;
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      inputStatus.textContent = '';
    },
    invalid: () => {
      submitButton.disabled = true;
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      inputStatus.textContent = 'invalid URL address';
    },
  };

  watch(state, 'formStatus', () => formStatusActions[state.formStatus]());

  input.addEventListener('input', () => {
    if (input.value.length === 0) {
      state.formStatus = 'empty';
    } else {
      state.formStatus = isURL(input.value) && !state.feedsURL.includes(input.value)
        ? 'valid'
        : 'invalid';
      state.currentURL = input.value;
    }
  });

  const render = (data) => {
    const title = data.querySelector('title').textContent;
    const description = data.querySelector('description').textContent;
    const items = data.querySelectorAll('item');
    const feedItem = `
        <li class="list-group-item border-0 pl-0">
          <h6 class="mb-1">${title}</h6>
          <p class="small mb-1">${description}</p>
        </li>`;
    feedsPart.insertAdjacentHTML('afterend', feedItem);
    items.forEach((item) => {
      const link = item.querySelector('link').textContent;
      const itemTitle = item.querySelector('title').textContent;
      const articleItem = `<a href="${link}" 
          class="list-group-item list-group-item-action border-0 pl-0" 
          target="_blank">${itemTitle}</a>`;
      articlesPart.insertAdjacentHTML('afterend', articleItem);
    });
  };

  inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = new URL(`${cors}${state.currentURL}`);
    const parser = new DOMParser();
    axios.get(url)
      .then((response) => {
        const parsedRSS = parser.parseFromString(response.data, 'application/xml');
        render(parsedRSS);
        state.formStatus = 'empty';
        state.feedsURL = [...state.feedsURL, state.currentURL];
      });
  });
};
