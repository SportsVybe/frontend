import axios from "axios";
import baseURL from "./base";
// let baseURL;
// console.log(baseURL);
// process.env.NODE_ENV === "production"
//   ? //? (baseURL = 'here should be your production endpoint')
//     (baseURL = window.location.origin)
//   : (baseURL = "http://localhost:5000");

const service = axios.create({ withCredentials: true, baseURL });

const actions = {
  isLoggedIn: async () => {
    return await service.get("/api/isLoggedIn");
  },
  signUp: async user => {
    return await service.post("/api/signup", user);
  },
  logIn: async user => {
    return await service.post("/api/login", user);
  },
  logOut: async () => {
    return await service.get("/api/logout");
  }
};

export default actions;

/**
 * import axios from 'axios';
let baseURL;

process.env.NODE_ENV === 'production'
  //? (baseURL = 'here should be your production endpoint')
  ? (baseURL = window.location.origin)
  : (baseURL = 'http://localhost:5000');

const service = axios.create({ withCredentials: true, baseURL });

const actions = {
  isLoggedIn: async () => {
    return await service.get('/is-logged-in');
  },
  signUp: async (user) => {
    return await service.post('/signup', user);
  },
  logIn: async (user) => {
    return await service.post('/login', user);
  },
  logOut: async () => {
    return await service.get('/logout');
  }
};

export default actions;

 */
