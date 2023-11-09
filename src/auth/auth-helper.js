import { logout } from './api-auth';

const auth = {
  isAuthenticated() {
    if (typeof window === 'undefined') return false;

    if (sessionStorage.getItem('jwt'))
      return JSON.parse(sessionStorage.getItem('jwt'));

    return false;
  },

  authenticate(jwt, cb) {
    if (typeof window !== 'undefined')
      sessionStorage.setItem('jwt', JSON.stringify(jwt));
    cb();
  },

  clearJWT(cb) {
    if (typeof window === 'undefined') return false

      sessionStorage.removeItem('jwt');
      cb();
      // optional
     return logout().then(data => {
        // reset cookie
        // document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      });
  },

  updateUser(user, cb) {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('jwt')) {
        const auth1 = JSON.parse(sessionStorage.getItem('jwt'));
        auth1.user = user;
        sessionStorage.setItem('jwt', JSON.stringify(auth1));
        cb();
      }
    }
  }
};

export default auth;
