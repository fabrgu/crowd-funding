import React from 'react';
import UserViews from './UserViews';

const exports = {...UserViews};

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Deployer">
        <h2>Create project</h2>
        {content}
      </div>
    );
  }
}

exports.SetProject = class extends React.Component {
  render() {
    const projectName = (this.state || {}).projectName;
    const description = (this.description || {}).description;
    const {parent, defaultDuration, standardUnit} = this.props;
    const amountNeeded = (this.state || {}).amountNeeded;
    const duration = (this.state || {}).duration || defaultDuration;
    return (
      <div>
        <input
          type='text'
          onChange={(e) => this.setState({projectName: e.currentTarget.value})}
        /> name
        <br />
        <input
          type='text'
          onChange={(e) => this.setState({description: e.currentTarget.value})}
        /> description
        <br />
        <input
          type='number'
          placeholder={defaultDuration}
          onChange={(e) => this.setState({duration: e.currentTarget.value})}
        /> days
        <br />
        <input
          type='number'
          onChange={(e) => this.setState({amountNeeded: e.currentTarget.value})}
        /> {standardUnit}
        <br />
        <button
          onClick={() => parent.setProjectDetails(projectName, description, duration, amountNeeded)}
        >Set Project Details</button>
      </div>
    );
  }
}

exports.Deploy = class extends React.Component {
  render() {
    const {parent, amountNeeded, standardUnit} = this.props;
    return (
      <div>
        Project (amount needed): <strong>{amountNeeded}</strong> {standardUnit}
        <br />
        <button
          onClick={() => parent.deploy()}
        >Deploy</button>
      </div>
    );
  }
}

exports.Deploying = class extends React.Component {
  render() {
    return (
      <div>Deploying... please wait.</div>
    );
  }
}

exports.WaitingForAttacher = class extends React.Component {
  async copyToClipboard(button) {
    const {ctcInfoStr} = this.props;
    navigator.clipboard.writeText(ctcInfoStr);
    const origInnerHTML = button.innerHTML;
    button.innerHTML = 'Copied!';
    button.disabled = true;
    await sleep(1000);
    button.innerHTML = origInnerHTML;
    button.disabled = false;
  }

  render() {
    const {ctcInfoStr} = this.props;
    return (
      <div>
        Waiting for Attacher to join...
        <br /> Please give them this contract info:
        <pre className='ContractInfo'>
          {ctcInfoStr}
        </pre>
        <button
          onClick={(e) => this.copyToClipboard(e.currentTarget)}
        >Copy to clipboard</button>
      </div>
    )
  }
}

export default exports;