
import * as globalVariables from './globalVariables';
const axios = require('axios').default;

const instance = axios.create({
  baseURL:globalVariables.url
})

export default instance;

