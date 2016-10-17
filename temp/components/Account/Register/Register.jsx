import { Component, PropTypes } from 'react';
import React from 'react';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import SubHeader from 'material-ui/Subheader';
import AutoComplete from '../../AutoComplete';
import cx from 'classnames';
import { observer } from 'mobx-react';
import Link from '../../Linkmaterial';
import form from './Container';
import dispatch from '~/core/dispatch';
import { observable, computed, action } from 'mobx';
const errorMessage = cx('red', 'm2');
const styles = {
  block: {
    width: '120px',
  },
  checkbox: {
    flex: 1,
    textAlign: 'left',
    display: 'inline-block',
  },
  groupItem: {
    width: '120px',
  },
  groupContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
const handleToggleCategory = (e) => {
  dispatch('auth.updateUserCategory', e.currentTarget.id);
};
const deselectResort = action((deleteIndex) => {
  form.$('resorts').setValue(form.$('resorts').value.filter((item, index) => index !== deleteIndex));
});
const selectResort = action((item) => {
  if (!form.$('resorts').value.length)
    form.$('resorts').setValue([item]);
  else
    form.$('resorts').setValue([...(form.$('resorts').value), item]);
});
@observer(['appstate'])
class Register extends Component {
  static propTypes = {
    appstate: PropTypes.object.isRequired,
    /* user: PropTypes.object.isRequired,
     usertype: PropTypes.string,
     category: PropTypes.object,
     price: PropTypes.any,
     gender: PropTypes.string,
     resort: PropTypes.any, //string or array
     */
  };
  
  constructor(props) {
    super(props);
    this.formState = props.appstate.auth;
  }
  
  /*
   handleChangeResort = (event, index, resort) => {
   dispatch('auth.updateUserValue', 'resort', resort);
   };
   updateValueField = (e) => {
   updateValue(e.target.name, e.target.value);
   };
   radiofieldChange = (e, selected) => {
   updateValue('gender', selected);
   };
   */
  componentWillMount() {
    dispatch('auth.initForm', form);
  }
  
  render() {
    const { boundaries } = this.formState.constant;
    // const { resorts } = this.formState;
    const {
      usertype, facebook, category, username, email, password, gender, price, resort
    } = this.formState.user;
    const bp = this.props.appstate.ui.breakpoints;
    const myrefs = 'btn-disabled';
    console.log(form);
    return (
      <div>
        {
          !facebook &&
          <Link
            flagRoute={false}
            to="/auth/facebook"
            onClick={form.loginauth2}
            key="1"
            width="100%"
            marginBottom="15"
            padding="5"
            hoverColor="#2d4373"
            backgroundColor="#3b5998"
            label="Log in with Facebook"
            icon={<i className="h1 fa fa-facebook"/>}
          />
        }
        {
          !facebook && <Divider />
        }
        {
          !facebook && <span className="h1">OR</span>
        }
        <form>
          <TextField
            name={form.$('username').name}
            value={form.$('username').value}
            hintText={form.$('username').label}
            floatingLabelText={form.$('username').label}
            errorText={form.$('username').asyncErrorMessage || form.$('username').errorMessage}
            onChange={form.$('username').sync}
          />
          <TextField
            name={form.$('email').name}
            value={form.$('email').value}
            hintText={form.$('email').label}
            floatingLabelText={form.$('email').label}
            errorText={form.$('email').errorMessage}
            onChange={form.$('email').sync}
          />
          <TextField
            name={form.$('password').name}
            value={form.$('password').value}
            hintText={form.$('password').label}
            floatingLabelText={form.$('password').label}
            errorText={form.$('password').errorMessage}
            onChange={form.$('password').sync}
          />
          
          <div>
            <SubHeader>{form.$('gender').label}</SubHeader>
            <RadioButtonGroup
              name={form.$('gender').name}
              value={form.$('gender').value}
              style={styles.groupContainer}
              defaultSelected="male"
              onChange={form.$('gender').sync}
            >
              <RadioButton
                label='Male'
                value='male'
                style={styles.groupItem}
              />
              <RadioButton
                label='Female'
                value='female'
                style={styles.groupItem}
              />
            </RadioButtonGroup>
          </div>
          { usertype === 'instructor' &&
          <TextField
            name={form.$('price').name}
            hintText={form.$('price').label}
            floatingLabelText={form.$('price').label}
            value={form.$('price').value}
            errorText={form.$('price').errorMessage}
            onChange={form.$('price').sync}
          />
          }
          <div
            className={cx(errorMessage, { hide: form.isValid })}
          >
            {form.$('category').asyncErrorMessage || form.$('category').errorMessage}
          </div>
          <div>
            <SubHeader>{form.$('category').label}</SubHeader>
            <div
              name={form.$('category').name}
              value={form.$('category').value}
              style={styles.groupContainer}
              className={cx('flex', { 'flex-column': bp.xs })}
            >
              <Checkbox
                id="ski"
                value={(form.$('category').$value.ski)}
                onCheck={action((e)=> {
                  let bool = (!(form.$('category').$value.ski));
                  form.$('category').setValue({ ski: bool, snowboard: form.$('category').$value.snowboard });
                })}
                checked={(form.$('category').$value.ski)}
                label="Ski"
                style={styles.groupItem}
              />
              <Checkbox
                id="snowboard"
                value={(form.$('category').$value.snowboard)}
                onCheck={action((e)=> {
                  let bool = (!(form.$('category').$value.snowboard));
                  form.$('category').setValue({ ski: form.$('category').$value.ski, snowboard: bool });
                })}
                checked={(form.$('category').$value.snowboard)}
                label="SnowBoard"
                style={styles.groupItem}
              />
            </div>
          </div>
          <div
            className={cx(errorMessage, { hide: form.isValid })}
          >
            {form.$('resorts').asyncErrorMessage || form.$('resorts').errorMessage}
          </div>
          <div>
            <SubHeader>{(usertype === 'client') ? form.$('resort').label : form.$('resorts').label}</SubHeader>
            { (usertype === 'instructor') &&
            <AutoComplete name={form.$('resorts').name}
                          value={form.$('resorts').$value}
                          hintText="Select resort"
                          stateselection={form.$('resorts').value || []} statefull={boundaries}
                          callbackselect={selectResort} callbackdeselect={deselectResort} id/>
            }
            { (usertype === 'client') &&
            <SelectField
              name={form.$('resort').name}
              floatingLabelStyle={{ left: 0 }}
              floatingLabelText={form.$('resort').label}
              value={form.$('resort').value}
              onChange={form.$('resort').sync}
            >
              {
                boundaries.map((resort, index) => (
                  <MenuItem value={resort.id} primaryText={resort.name}/>
                ))
              }
            </SelectField>
            }
          
          </div>
          <div className="mt3">
            <FlatButton
              type="submit"
              disabled={!form.isValid}
              className={cx({ [`${myrefs}`]: !form.isValid })}
              onClick={form.handleOnSubmit}
              backgroundColor="#a4c639"
              hoverColor="#8AA62F"
            >
              Register
            </FlatButton>
          </div>
        </form>
      </div>
    );
  }
}
export default Register;
