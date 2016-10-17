import Form from 'mobx-react-form';
import validatorjs from 'validatorjs';
import dispatch from '~/core/dispatch';
const lang = window.__lang__;
validatorjs.useLang(lang);
const messages = validatorjs.getMessages(lang);
if (lang === 'fr') {
  messages.email = messages.required = "L'email est obligatoire pour qu'on puisse vous joindre!";
}
else {
  messages.email = messages.required = "Without an :attribute we can't reach you!";
}
validatorjs.setMessages(lang, messages);
class LoginForm extends Form {
  onSuccess(formState) {
    dispatch('auth.login', formState.values())
      .then(() => dispatch('modal.accountModal.showLoginModal', false))
      .then(() => dispatch('ui.snackBar.open', 'Login Successful.'))
      .then(() => formState.clear())
      .catch((err) => formState.invalidate(err.message));
  }
}
export default new LoginForm({
  plugins: {
    dvr: validatorjs,
  },
  fields: {
    email: {
      label: 'Email',
      rules: 'required|email|string|between:5,40',
    },
    password: {
      label: 'Password',
      rules: 'required|string|between:5,20'
    },
  },
});
