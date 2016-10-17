import React, { Component, PropTypes } from 'react';
import Chip from 'material-ui/Chip';
import map from 'lodash/map';
import AutoComplete from 'material-ui/AutoComplete';
class AutoCompleteResort extends Component {
  static propTypes = {
    hintText: PropTypes.string.isRequired,
    stateselection: PropTypes.any.isRequired,
    statefull: PropTypes.any.isRequired,
    callbackselect: PropTypes.func.isRequired,
    callbackdeselect: PropTypes.func.isRequired,
    id: PropTypes.bool,
    other: PropTypes.any
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
    this.autoCompleteBoundaries = [];
    this.searchText = "";
  }
  
  requestInsert(value, index) {
    this.props.callbackselect(this.autoCompleteBoundaries[index]);
    if (index > -1)  //only allow selected items to be added
    {
      setTimeout(()=> {
        this.refs[`autocomplete`].setState({ searchText: '' });
        this.refs[`autocomplete`].focus();
      }, 500);
    }
    this.searchText = '';
  }
  
  requestDelete(index, resort, event) {
    if (this.props.id)
      this.props.callbackdeselect(index);
    else
      this.props.callbackdeselect(resort);
  }
  
  render() {
    let dataSource, chosenResorts;
    this.autoCompleteBoundaries = this.props.statefull.filter((itemfull) => {
      let ret = true;
      this.props.stateselection.map((item) => {
        if (this.props.id) {
          if (item && item._id === itemfull._id) {
            ret = false;
          }
        } else {
          if (item === itemfull) {
            ret = false;
          }
        }
      });
      return ret;
    });
    if (this.props.id)
      dataSource = this.autoCompleteBoundaries.map((boundary) => boundary.name);
    else
      dataSource = this.autoCompleteBoundaries;
    if (this.props.id && this.props.stateselection)
      chosenResorts = this.props.stateselection.map((boundary) => (boundary ? boundary.name : '')).filter((value) => value.length > 0);
    else
      chosenResorts = this.props.stateselection;
    return (
      <div {...this.props.other}>
        <AutoComplete
          hintText={this.props.hintText}
          openOnFocus={true}
          ref={`autocomplete`}
          searchText={this.searchText}
          style={{ width: '250px' }}
          listStyle={{ width: '250px' }}
          textFieldStyle={{ width: '250px' }}
          filter={AutoComplete.caseInsensitiveFilter}
          dataSource={dataSource}
          onNewRequest={this.requestInsert.bind(this)}
        />
        <div style={{ width: '100%', display: 'inline-flex', justifyContent: 'center' }}>
          {
            map(chosenResorts, (resort, index) => (
              <Chip
                key={resort + "_" + index}
                style={{ marginTop: 5 }}
                type="chip"
                onRequestDelete={this.requestDelete.bind(this, index, resort)}
              >
                {resort}
              </Chip>
            ))
          }
        </div>
      </div>
    );
  }
}
export default AutoCompleteResort;
