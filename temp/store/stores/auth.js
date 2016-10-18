/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

// eslint-disable import/no-unresolved
import { observable, computed, action, autorun, reaction } from 'mobx';
import { extend } from '~/core/decorators';
import dispatch from '~/core/dispatch';
import { app, service } from '~/shared/app';
import _ from 'lodash';
import constant from './constant';
@extend({
  constant
})
export default class AuthStore {
  jwt = undefined;
  @observable fetched = false;
  @observable Connected = false;
  @observable user = {};
  @observable resorts = []; //start with default boundaries after it's the selection of resort
  @observable listcomponent = [];
  @observable resort; //contains resort id of selection  /// used for client register and for mainpage resort selection
  isConnected() {
    return this.Connected;
  }

  @computed
  get theUser() {
    return this.user;
  }
  
  @computed
  get theEmail() {
    console.log(this.user)
    console.log(this.user.email)
    return this.user.email;
  }
  
  @action
  initForm(form) {
    const {
      category, username, email, password, gender, price, resort, resorts
    } = this.user;
    let boolski, boolsnow;
    form.$('username').setValue(username);
    form.$('email').setValue(email);
    form.$('password').setValue(password);
    form.$('gender').setValue(gender);
    form.$('price').setValue(price);
    //form.$('resort').$value = resort;
    if (category) {
      if (category.includes('snowboard')) {
        boolsnow = true;
      }
      if (category.includes('ski')) {
        boolski = true;
      }
      form.$('category').setValue({ ski: boolski, snowboard: boolsnow });
    } else {
      form.$('category').setValue({ ski: true, snowboard: false });
    }
    let allresorts = this.constant.boundaries.filter((boundary) => boundary.default);
    if (resorts) {
      const resortselect = allresorts.filter((boundary) => (resorts.includes(boundary._id)));
      form.$('resorts').setValue([...resortselect]);
      form.$('resort').setValue(resort);
    }
  }
  
  runBoundary() {
    this.constant.getBoundary()
      .then(action(() => {
        this.resorts = this.constant.boundaries.filter((boundary) => boundary.default);
        this.jwtAuth();
      }));
  }
  
  init() {
    /*
     autorun(action(() => {
     if (this.user.email !== '')
     this.Connected = true;
     else
     this.Connected = false;
     }));
     */
    reaction(() => this.user.email, action(() => {
      this.Connected = (this.user.email !== '');
    }))
    this.fetched = false;
    this.resorts.length = 30;
    this.listcomponent.length = 30;
    // get token from localStorage
    console.log(window.localStorage);
    let managecrossstorage;
    // auto-login with jwt
    if (!process.env.__DEV__) {
      window._q && window._q.whenDone(() => {
        //check in crossbrowser
        const that = this;
        const $ = jQuery;
        managecrossstorage = ()=> {
          window.hubstorage = new CrossStorageClient('/dist/hub.html');
          window.hubstorage.onConnect().then(function () {
            return window.hubstorage.get('feathers-jwt');
          }).then(function (res) {
            if (res) {
              window.localStorage.setItem('feathers-jwt', res);
              that.runBoundary();
            } else {
              window.localStorage.clear();
              that.runBoundary();
            }
          });
        }
        $(document).ready(managecrossstorage);
      });
    } else {
      this.runBoundary();
    }
  }
  
  @action
  updateUser(data = {}) {
    this.updateUserLocation();
    if (!process.env.__DEV__) {
      if (!data.token) {
        window.hubstorage.onConnect().then(function () {
          return window.hubstorage.del('feathers-jwt');
        });
      }
      if (data && data.token) {
        window.localStorage.setItem('feathers-jwt', data.token);
        window.hubstorage.onConnect().then(function () {
          return window.hubstorage.set('feathers-jwt', data.token);
        });
      }
    }
    if (!_.isEmpty(data)) {
      if (!data.data) {
        const user = app().get('user');
        return this.initializeUser(user);
      } else {
        if (data.data.verified === false) {
          window.localStorage.setItem('feathers-jwt', '');
          return alert('user verification failed');
        }
        return this.initializeUser(data.data);
      }
    } else {
      data.usertype = "client";
      data.resorts = this.resorts.map((boundary) => boundary._id);
      data.resort = data.resorts[0];
      data.category = ["ski"];
      /*
       this.user.price = data.price;
       this.user.facebook = data.facebook;
       this.user.usertype = data.usertype;
       this.user.category = data.category;
       this.user.resort = data.resort;
       this.user.resorts = data.resorts;
       this.user.username = data.username;
       this.user.email = data.email;
       this.user.gender = data.gender;
       this.user.languages = data.languages;
       this.user.uuid = data.uuid;*/
      this.user = { ...data };
      this.fetched = true;
    }
    return true;
  }
  
  @action
  jwtAuth() {
    return app()
      .authenticate({})
      .then(action((result) => {
        const user = result.data;
        return this.updateUser(result);
      })).then(action((pass)=> {
        if (pass) {
          console.log(this.user);
          if (this.user.usertype === '') {
            dispatch('modal.accountModal.showSelectAccountModal');
          } else if (this.user && ((!this.user.resorts) || (this.user.resorts.length === 0))) {
            dispatch('modal.accountModal.showCreateAccountModal');
          }
        }
      }));
    /* .catch(action((err)=> {
     console.log(err);
     this.constant.isAdmin = false;
     this.fetched = true;
     let a = this.updateUser({});
     }));
     .catch((err) => {
     console.error('errorauth');
     console.error(err);
 
     //in production only  window.localStorage.setItem('feathers-jwt', '');
     //  window.location.reload();
     //dtb changed deleting token or something happen
     // reload page
     });  // eslint-disable-line no-console
     */
  }
  
  @action
  login({ email, password }) {
    return app()
      .authenticate({ type: 'local', email, password })
      .then((result) => {
        this.updateUser(result);
      })
      .catch((err) => {
        console.error('error login');
        console.error(err);
      });
  }
  
  @action
  register(user) {
    let category = [];
    if (user.category.ski) {
      category.push('ski');
    }
    if (user.category.snowboard) {
      category.push('snowboard');
    }
    user.category = category;
    user.resorts = user.resorts.map((boundary) => boundary._id);
    user = Object.assign({}, this.user, user);
    return service('users').create(user)
      .then(action((data) => this.updateUser({ data })))
      .catch((err) => {
        console.error('errorauth');
        console.error(err);
      });
  }
  
  @action
  update(user) {
    const query = { uuid: this.user.uuid };
    let category = [];
    if (user.category.ski) {
      category.push('ski');
    }
    if (user.category.snowboard) {
      category.push('snowboard');
    }
    user.category = category;
    user.resorts = user.resorts.map((boundary) => boundary._id);
    user = Object.assign({}, this.user, user);
    return service('users').patch(null, user, { query })
      .then(action((user) => {
        let data = {};
        data.data = user[0];
        this.updateUser({ data });
      })).catch((err) => {
        console.error('errorauth');
        console.error(err);
      });
  }
  
  @action
  logout() {
    return app().logout().then(() => this.updateUser({}));
  }
  
  @observable ski = true;
  @observable snowboard = false;
  @observable courchevel = true;
  @observable meribel = false;
  @observable valthorens = false;
  
  @action
  updateUserValue(key, value) {
    this.user[key] = value;
  }
  
  @action
  initializeUser(data) {
    const { facebook, usertype } = data;
    if (data.username === 'simon' || data.username === 'nicoloas') {
      this.constant.isAdmin = true;
    } else {
      this.constant.isAdmin = false;
    }
    if (facebook) {
      // on updating these value are already set by user
      if (!data.username)
        data.username = facebook.first_name;
      if (!data.email)
        data.email = facebook.email;
    }
    if (data.username)
      data.username = data.username.toLowerCase();
    data.gender = data.gender || 'male';
    if (data.resorts && data.resorts.length) {
      data.resort = data.resorts[0];
    } else {
      if (usertype === 'instructor') {
        data.resorts = this.resorts.map((boundary) => boundary._id);
        data.resort = data.resorts[0];
      } else {
        data.resorts = this.resorts.map((boundary) => boundary._id);
        data.resort = data.resort || this.resorts[0]._id;
      }
    }
    if (!data.languages)
      data.languages = ['french', 'english'];
    data.price = data.price || 400;
    data.category = data.category || ['ski'];
    if (!this.resort) {
      this.resort = data.resort;
    }
    data.flagOwner = true;
    /*
     this.user.flagOwner = data.flagOwner;
     this.user.price = data.price;
     this.user.facebook = data.facebook;
     this.user.usertype = data.usertype;
     this.user.category = data.category;
     this.user.resort = data.resort;
     this.user.resorts = data.resorts;
     this.user.username = data.username;
     this.user.email = data.email;
     this.user.gender = data.gender;
     this.user.languages = data.languages;
     this.user.uuid = data.uuid;*/
    this.user = { ...data };
    this.fetched = true;
    return true;
  }
  
  getUsername(username) {
    const query = { username: username };
    return service("users").find({ query })
      .then((result) => {
        return result;
      });
  }
  
  @action
  updateUserCategory(category) {
    this[category] = !this[category];
    this.user.category = [];
    if (this.ski) {
      this.user.category.push('ski');
    }
    if (this.snowboard) {
      this.user.category.push('snowboard');
    }
    //  this.user = { ...this.user };
  }
  
  @action
  selectResort(resort) {
    this.resorts = this.resorts.concat(resort);
    // this.user.resorts = this.user.resorts.concat(resort.id);
    // this.user = { ...this.user };
  }
  
  @action
  deselectResort(deleteIndex) {
    this.resorts = this.resorts.filter((item, index) => index !== deleteIndex);
    // this.user.resorts = this.user.resorts.filter((item, index) => index !== deleteIndex);
    //   this.user.chosenResort = [...this.user.chosenResort];
    //   this.user.resort = [...this.user.resort];
    //  this.user = { ...this.user };
  }
  
  updateUserLocation() {
    // navigator.geolocation.getCurrentPosition((position) => {
    //   if (position && position.coords) {
    //     const { latitude, longitude } = position.coords;
    const latitude = 45.3007;
    const longitude = 6.5900;
    /*   const data = {
     requestType: 'updateUserLocation',
     latitude,
     longitude,
     };
     return service('markers').patch(null, data);*/
    //   }
    // });
  }
}
