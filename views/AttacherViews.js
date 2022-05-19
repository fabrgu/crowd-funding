import React from 'react';
import UserViews from './UserViews';

const exports = {...UserViews};

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Attacher">
        <h2>Fund projects</h2>
        {content}
      </div>
    );
  }
}

exports.Attach = class extends React.Component {
  render() {
    const {parent} = this.props;
    const {ctcInfoStr} = this.state || {};
    return (
      <div>
        Please paste the contract info to attach to:
        <br />
        <textarea spellCheck="false"
          className='ContractInfo'
          onChange={(e) => this.setState({ctcInfoStr: e.currentTarget.value})}
          placeholder='{}'
        />
        <br />
        <button
          disabled={!ctcInfoStr}
          onClick={() => parent.attach(ctcInfoStr)}
        >Attach</button>
      </div>
    );
  }
}

exports.Attaching = class extends React.Component {
  render() {
    return (
      <div>
        Attaching, please wait...
      </div>
    );
  }
}

exports.AcceptTerms = class extends React.Component {
  render() {
    const {projectName, amountToFund, standardUnit, parent} = this.props;
    const {disabled} = this.state || {};
    return (
      <div>
        The terms are:
        <br />
        Project: {projectName}
        Amount to fund: {amountToFund} {standardUnit}
        <br />
        <br />
        <button
          disabled={disabled}
          onClick={() => {
            this.setState({disabled: true});
            parent.termsAccepted();
          }}
        >Fund project</button>
      </div>
    );
  }
}

exports.ProjectFunded = class extends React.Component {
  // show name how much it's funded/how much more to fund
  render() {
    return (
      <div>
       You have funded the project. Waiting for project to be fully funded.
      </div>
    );
  }
}

export default exports;