import React from 'react';
import AppViews from './views/AppViews';
import DeployerViews from './views/DeployerViews';
import AttacherViews from './views/AttacherViews';
import {renderDOM, renderView} from './views/render';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
import { ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';

const reach = loadStdlib(process.env);
reach.setWalletFallback(reach.walletFallback({
  providerEnv: 'TestNet', MyAlgoConnect }));

const {standardUnit} = reach;
const defaults = {defaultFundAmt: '10', defaultDuration: '7', standardUnit};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'ConnectAccount', ...defaults};
  }
  async componentDidMount() {
    const acc = await reach.getDefaultAccount();
    const balAtomic = await reach.balanceOf(acc);
    const bal = reach.formatCurrency(balAtomic, 4);
    this.setState({acc, bal});
    if (await reach.canFundFromFaucet()) {
      this.setState({view: 'FundAccount'});
    } else {
      this.setState({view: 'DeployerOrAttacher'});
    }
  }
  async fundAccount(fundAmount) {
    await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAmount));
    this.setState({view: 'DeployerOrAttacher'});
  }
  async skipFundAccount() { this.setState({view: 'DeployerOrAttacher'}); }
  selectAttacher() { this.setState({view: 'Wrapper', ContentView: Attacher}); }
  selectDeployer() { this.setState({view: 'Wrapper', ContentView: Deployer}); }
  render() { return renderView(this, AppViews); }
}

class User extends React.Component {
  random() { return reach.hasRandom.random(); }
  seeOutcome(i) { this.setState({view: 'Done', outcome: intToOutcome[i]}); }
  informTimeout() { this.setState({view: 'Timeout'}); }
}

class Deployer extends User {
  constructor(props) {
    super(props);
    this.state = {view: 'SetProject'};
  }
  setProjectDetails(projectName, description, duration, amountNeeded) { 
    this.setState({view: 'Deploy', projectName, description, duration, amountNeeded}); 
  }
  async deploy() {
    const ctc = this.props.acc.contract(backend);
    this.setState({view: 'Deploying', ctc});
    this.amountNeeded = reach.parseCurrency(this.state.amountNeeded); // UInt
    this.duration = this.state.duration;
    this.projectName = this.state.projectName;
    this.description = this.state.description;
    // this.deadline = {ETH: 10, ALGO: 100, CFX: 1000}[reach.connector]; // UInt
    console.log(ctc);
    console.log(this);
    console.log('before Creator');
    try {
      backend.Creator(ctc, this);
    } catch(error) {
      console.error(error);
    }
    console.log('after Creator');
    try {
      console.log('trying');
      const ctcInfo = await ctc.getInfo();
      console.log(ctcInfo);
      const ctcInfoStr = JSON.stringify(ctcInfo, null, 2);
      console.log(ctcInfoStr);
      console.log('before view change');
      this.setState({view: 'WaitingForAttacher', ctcInfoStr});
      console.log('after view change');
    } catch(error) {
      console.log('erroring out');
      console.log(error);
    }
  }
  render() { return renderView(this, DeployerViews); }
}
class Attacher extends User {
  constructor(props) {
    super(props);
    this.state = {view: 'Attach'};
  }
  attach(ctcInfoStr) {
    const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
    this.setState({view: 'Attaching'});
    backend.Funder(ctc, this);
  }
  async acceptAmountToFund(amountAtomic) { // Fun([UInt], Null)
    const amountToFund = reach.formatCurrency(amountAtomic, 4);
    return await new Promise(resolveAcceptedP => {
      this.setState({view: 'AcceptTerms', amountToFund, projectName, description, resolveAcceptedP});
    });
  }
  termsAccepted() {
    this.state.resolveAcceptedP();
    this.setState({view: 'ProjectFunded'});
  }
  render() { return renderView(this, AttacherViews); }
}

renderDOM(<App />);