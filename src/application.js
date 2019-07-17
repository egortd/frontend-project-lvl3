import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import isURL from 'validator/lib/isURL';
import $ from 'jquery';
import parseFeed from './parser';
import render from './renderers';

export default () => {
  const state = {
    formStatus: 'empty',
    feedsURL: [],
    currentURL: null,
    feeds: [],
    modal: {
      status: 'hidden',
      description: '',
    },
  };

  const inputForm = document.querySelector('#inputForm');
  const input = document.querySelector('#addUrl');
  const inputStatus = document.querySelector('#inputStatus');
  const submitButton = document.querySelector('#submitButton');
  const loadingSpinner = document.querySelector('.spinner-border');
  const modal = document.querySelector('#desсriptionModal');
  const cors = 'https://cors-anywhere.herokuapp.com/';

  const makeInvalidStatusAction = () => {
    submitButton.disabled = true;
    input.classList.remove('is-valid');
    inputStatus.classList.remove('text-success');
    input.classList.add('is-invalid');
    inputStatus.classList.add('text-danger');
  };
  const hideSpinner = () => {
    loadingSpinner.hidden = true;
    submitButton.lastChild.textContent = 'Submit';
  };

  const formStatusActions = {
    empty: () => {
      input.value = '';
      submitButton.disabled = true;
      hideSpinner();
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
      makeInvalidStatusAction();
      inputStatus.textContent = 'invalid URL address';
    },
    loading: () => {
      loadingSpinner.hidden = false;
      submitButton.disabled = true;
      submitButton.lastChild.textContent = ' Loading...';
    },
    error: () => {
      makeInvalidStatusAction();
      hideSpinner();
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

  inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    state.formStatus = 'loading';
    const url = new URL(`${cors}${state.currentURL}`);
    axios.get(url)
      .then((response) => {
        const feed = parseFeed(response.data);
        state.formStatus = 'empty';
        state.feedsURL = [...state.feedsURL, state.currentURL];
        state.feeds = [...state.feeds, feed];
      })
      .catch((error) => {
        state.formStatus = 'error';
        inputStatus.textContent = error;
      });
  });
  const update = () => {
    const promises = state.feedsURL.map(url => axios.get(new URL(`${cors}${url}`)));
    const promise = Promise.all(promises);

    return promise.then((responses) => {
      const receivedFeeds = responses.map(response => parseFeed(response.data));
      if (state.feeds.includes(...receivedFeeds)) {
        return;
      }
      state.feeds = receivedFeeds;
    }).then(() => setTimeout(update, 5000));
  };
  update();

  watch(state, 'feeds', () => render(state.feeds));

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
