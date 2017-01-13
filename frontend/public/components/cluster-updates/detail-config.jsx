import React from 'react';
import classNames from 'classnames';

import {LoadingInline} from '../utils';

// Displays a field of a config & enables the user to click
// on the value to edit in a modal.
//
// Eg, choosing an update channel or toggling automatic updates
export class DetailConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outdated: false
    };
    this._openModal = this._openModal.bind(this);
  }

  componentWillReceiveProps() {
    this._updateOutdated(false);
  }

  _openModal() {
    this.props.modal(_.defaults({}, this.props.modalData, {
      config: this.props.config,
      callbacks: {
        invalidateState: this._updateOutdated.bind(this)
      }
    }));
  }

  _updateOutdated(outdated) {
    this.setState({
      outdated
    });
  }

  render() {
    if (this.props.config) {
      let displayText = this.props.config[this.props.field];
      if (this.props.displayFunction) {
        displayText = this.props.displayFunction(displayText);
      }
      const outdatedClass = this.state.outdated ? 'text-muted': null;
      return <a onClick={this._openModal} className={classNames('co-m-modal-link', outdatedClass)}>{displayText}</a>;
    }
    return <LoadingInline />;
  }
}
DetailConfig.propTypes = {
  config: React.PropTypes.object,
  displayFunction: React.PropTypes.func,
  modal: React.PropTypes.func.isRequired,
  modalData: React.PropTypes.object,
  field: React.PropTypes.string.isRequired
};
