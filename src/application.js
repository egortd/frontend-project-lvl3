import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import isURL from 'validator/lib/isURL';
import $ from 'jquery';

export default () => {
  const state = {
    formStatus: 'empty',
    feedsURL: [],
    currentURL: null,
    modal: {
      status: 'hidden',
      description: '',
    },
  };

  const inputForm = document.querySelector('#inputForm');
  const input = document.querySelector('#addUrl');
  const inputStatus = document.querySelector('#inputStatus');
  const submitButton = document.querySelector('#submitButton');
  const modal = document.querySelector('#desсriptionModal');
  const feedsPart = document.querySelector('#feeds');
  const articlesPart = document.querySelector('#articles');
  const cors = 'https://cors-anywhere.herokuapp.com/';

  const formStatusActions = {
    empty: () => {
      input.value = '';
      submitButton.disabled = true;
      input.classList.remove('is-valid', 'is-invalid');
      inputStatus.classList.remove('text-danger', 'text-success');
      inputStatus.textContent = '';
    },
    valid: () => {
      submitButton.disabled = false;
      input.classList.remove('is-invalid');
      inputStatus.classList.remove('text-danger');
      input.classList.add('is-valid');
      inputStatus.classList.add('text-success');
      inputStatus.textContent = 'valid URL address';
    },
    invalid: () => {
      submitButton.disabled = true;
      input.classList.remove('is-valid');
      inputStatus.classList.remove('text-success');
      input.classList.add('is-invalid');
      inputStatus.classList.add('text-danger');
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
      const itemDescription = item.querySelector('description').textContent;
      const itemArticle = `<li class="list-group-item list-group-item-action pl-0 border-0">
      <a href="${link}" target="_blank" class="text-decoration-none text-reset">${itemTitle}</a>
      <a href="#" class="badge badge-light" data-toggle="modal"
      data-target="#desсriptionModal" data-description="${itemDescription}">description</a></li>`;
      articlesPart.insertAdjacentHTML('afterend', itemArticle);
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

  $('#desсriptionModal').on('show.bs.modal', (event) => {
    const current = $(event.relatedTarget);

    state.modal.description = current.data('description');
    state.modal.status = 'active';
  });

  $('#desсriptionModal').on('hide.bs.modal', () => {
    state.modal.status = 'hidden';
    state.modal.description = '';
  });

  watch(state, 'modal', () => {
    if (state.modal.status === 'hidden') {
      return;
    }
    modal.querySelector('.modal-body').textContent = state.modal.description;
  });
};
