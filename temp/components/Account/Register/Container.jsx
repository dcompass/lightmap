import Form from 'mobx-react-form';
import validatorjs from 'validatorjs';
import { action } from 'mobx';
import dispatch from '~/core/dispatch';
const lang = window.__lang__;
const messages = validatorjs.getMessages(lang);
if (lang === 'fr') {
  messages.required = "Sans le :attribute vous ne pourrez valider!";
  messages['required.password'] = "Veuillez rentrer un password";
  messages['required.email'] = "L'email est obligatoire pour qu'on puisse vous joindre!";
  messages.checkUser = "Ce username est déja pris!";
  messages['required.resorts'] = "Veuillez renseigner une station de ski";
  messages['both_false.ski'] = "Veuillez additionner une category!";
  messages['both_false.snowboard'] = "Veuillez additionner une category!";
}
else {
  messages.required = "Without an :attribute we cannot get in!";
  messages['required.password'] = "Give us a correct password";
  messages['required.email'] = "email is obligatory to join yu!";
  messages.checkUser = "This username already taken";
  messages['required.resorts'] = "Give us one resort you are going to";
  messages['both_false.ski'] = "Please add one category!";
  messages['both_false.snowboard'] = "Please add one category!";
}
validatorjs.setMessages(lang, messages);
console.log('fr');
validatorjs.useLang(lang);
class RegisterForm extends Form {
  onError(form) {
    // get all form errors
    console.log('All form errors', form.errors());
    // invalidate the form with a custom error message
    form.invalidate('This is a generic error message!');
  }
  
  onSuccess(formState) {
    console.log(dispatch('auth.isConnected'));
    const Myaction = dispatch('auth.isConnected') ? 'auth.update' : 'auth.register';
    dispatch(Myaction, formState.values())
      .then(() => dispatch('ui.snackBar.open', 'Register Successful.'))
      .then(() => formState.clear())
      .then(() => dispatch('modal.accountModal.showCreateAccountModal', false))
      .then(() => dispatch('modal.accountModal.showLoginModal', true))
      .catch((err) => {
        console.log(err);
        formState.invalidate(`The user already exist. ${err}`);
      });
  }
}
const asyncRules = {
  checkUser: (value, attr, key, passes) => {
    const msg = `Hey! The username ${value} is already taken.`;
    // show error if the call does not returns entries
    if (dispatch('auth.isConnected'))
      return passes();
    dispatch('auth.getUsername', value)
      .then(items => (items.length === 0) ? passes() : passes(false, msg));
  }
}
// const rules = {
//   telephone: {
//     function: (value) => value.match(/^\d{3}-\d{3}-\d{4}$/),
//     message: 'The :attribute phone number is not in the format XXX-XXX-XXXX.',
//   },
// };
const dvrExtend = $validator => Object.keys(asyncRules)
  .forEach(key => $validator.registerAsyncRule(key, asyncRules[key]));
export default new RegisterForm({
  plugins: {
    dvr: {
      package: validatorjs,
      extend: dvrExtend,
    }
  },
  fields: {
    username: {
      label: 'Username',
      rules: 'checkUser|required|string|between:5,20',
    },
    email: {
      label: 'Email',
      rules: 'required|email|string|between:5,40',
    },
    password: {
      label: 'Password',
      rules: 'required|string|between:5,20'
    },
    price: {
      label: 'Price per day',
      value: 400,
      default: 400,
      rules: 'integer|between:250,500',
    },
    gender: {
      label: 'Select Gender',
      rules: 'required|string',
    },
    category: {
      label: 'Select Category',
      value: { ski: false, snowboard: false },
      rules: {
        ski: 'boolean|both_false:snowboard',
        snowboard: 'boolean|both_false:ski'
      }
    },
    resorts: {
      label: 'Select resorts:',
      value: [],
      rules: 'required|array',
    },
    resort: {
      label: 'Select resort',
      rules: 'string',
    },
  }
});
