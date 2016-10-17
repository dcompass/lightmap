/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import Form from 'mobx-react-form';
import validatorjs from 'validatorjs';
import dispatch from '~/core/dispatch';
class UserForm extends Form {
  loginauth2 = (e) => {
    e.preventDefault();
    window.location.reload(true);
    return true;
  };
  handleOnSubmit = (e) => {
    e.preventDefault();
    this.validate()
      .then((isValid) =>
      isValid && this.onSuccess());
  }
  
  onSuccess() {
    dispatch('auth.login', this.values())
      .then(() => dispatch('modal.accountModal.showLoginModal', false))
      .then(() => dispatch('ui.snackBar.open', 'Login Successful.'))
      .then(() => this.clear())
      .catch((err) => this.invalidate(err.message));
  }
}
export default
new UserForm({
  plugins: {
    dvr: validatorjs,
  },
  fields: {
    username: {
      label: 'Username',
      rules: 'required|string|between:5,20',
    },
    email: {
      label: 'Email',
      rules: 'required|email|string|between:5,20',
    },
    password: {
      label: 'Password',
      rules: 'required|string|between:5,20',
    },
  },
});
