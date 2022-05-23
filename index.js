import React from 'react';
import AppViews from './views/AppViews';
import DeployerViews from './views/DeployerViews';
import AttacherViews from './views/AttacherViews';
import {renderDOM, renderView} from './views/render';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
import { ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  setProjectDetails(projectName, duration, amountNeeded) { 
    console.log(projectName);
    console.log(duration);
    console.log(amountNeeded);
    this.setState({view: 'Deploy', projectName, duration, amountNeeded}); 
  }
  async deploy() {
    const ctc = this.props.acc.contract(backend);
    this.setState({view: 'Deploying', ctc});
    this.amountNeeded = reach.parseCurrency(this.state.amountNeeded); // UInt
    this.duration = this.state.duration;
    this.projectName = this.state.projectName;
    // this.deadline = {ETH: 10, ALGO: 100, CFX: 1000}[reach.connector]; // UInt
    backend.Creator(ctc, this);
    const ctcInfo = await ctc.getInfo();
    const ctcInfoStr = JSON.stringify(ctcInfo, null, 2);
    this.setState({view: 'WaitingForAttacher', ctcInfoStr});
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
  async acceptAmountToFund(projectName, amountAtomic, amountFunded) {
    const amountNeeded = reach.formatCurrency(amountAtomic, 4);
    const amountToFund = await new Promise(resolveAcceptedP => {
      this.setState({view: 'AcceptTerms', amountNeeded, projectName, amountFunded, resolveAcceptedP});
    });
    console.log(amountToFund)
    return amountToFund;
  }
  setAmountToFund(amountToFund, fundLimit) {
    if (amountToFund > fundLimit) {
        console.log("Too much");
        this.setState({amountFundMessage: "Too much money "});
        return;
    }
    if (isNaN(amountToFund) || amountToFund <= 0){
      console.log('should not be here');
      this.setState({amountFundMessage: ""});
      this.setState({amountToFund: 0});
    } else {
      this.setState({amountFundMessage: "Ready to fund."});
      this.setState({amountToFund: amountToFund});
    }

  }
  termsAccepted() {
    this.state.resolveAcceptedP(this.state.amountToFund);
    console.log('accepted');
    this.setState({view: 'ProjectFunded'});
  }
  render() { return renderView(this, AttacherViews); }
}

renderDOM(<App />);