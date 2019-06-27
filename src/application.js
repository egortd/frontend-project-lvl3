import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import isURL from 'validator/lib/isURL';

export default () => {
  const state = {
    form: {
      valid: true,
    },
  };
  const input = document.querySelector('#addUrl');

  input.addEventListener('keyup', () => {
    state.form.valid = isURL(input.value) || input.value.length === 0;
  });

  watch(state, 'form', () => {
    input.style.border = (state.form.valid === true) ? null : 'thick solid red';
  });
};
