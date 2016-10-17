import React, { Component, PropTypes } from 'react';
import transitions from 'material-ui/styles/transitions';
function getStyles(props, context, state) {
  const {
    color,
    hoverColor,
  } = props;
  const { baseTheme } = context.muiTheme;
  const offColor = color;
  const onColor = hoverColor || offColor;
  return {
    root: {
      color: state.hovered ? onColor : offColor,
      position: 'relative',
      fontSize: baseTheme.spacing.iconSize,
      display: 'inline-block',
      userSelect: 'none',
      transition: transitions.easeOut(),
    },
  };
}
class FontIcon extends Component {
  static muiName = 'FontIcon';
  static propTypes = {
    color: PropTypes.string,
    /**
     * This is the icon color when the mouse hovers over the icon.
     */
    hoverColor: PropTypes.string,
    /** @ignore */
    onMouseEnter: PropTypes.func,
    /** @ignore */
    onMouseLeave: PropTypes.func,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
  };
  static defaultProps = {
    onMouseEnter: () => {
    },
    onMouseLeave: () => {
    },
  };
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };
  state = {
    hovered: false,
  };
  handleMouseLeave = (event) => {
    // hover is needed only when a hoverColor is defined
    if (this.props.hoverColor !== undefined) {
      this.setState({ hovered: false });
    }
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(event);
    }
  };
  handleMouseEnter = (event) => {
    // hover is needed only when a hoverColor is defined
    if (this.props.hoverColor !== undefined) {
      this.setState({ hovered: true });
    }
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(event);
    }
  };
  
  render() {
    const {
      hoverColor, // eslint-disable-line no-unused-vars
      onMouseLeave, // eslint-disable-line no-unused-vars
      onMouseEnter, // eslint-disable-line no-unused-vars
      style,
      ...other,
    } = this.props;
    const { prepareStyles } = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);
    return (
      <span
        {...other}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        style={prepareStyles(Object.assign(styles.root, style))}
      />
    );
  }
}
export default FontIcon;
