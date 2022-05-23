import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const exports = {};

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="App">
        <header className="App-header text-center" id="root">
          <h1>Crowd-funding</h1>
          {content}
        </header>
      </div>
    );
  }
}

exports.ConnectAccount = class extends React.Component {
  render() {
    return (
      <Alert key="primary" variant="primary">
        Please wait while we connect to your account.
        If this takes more than a few seconds, there may be something wrong.
      </Alert>
    )
  }
}

exports.FundAccount = class extends React.Component {
  render() {
    const {bal, standardUnit, defaultFundAmt, parent} = this.props;
    const amt = (this.state || {}).amt || defaultFundAmt;
    return (
      <Container>
        <h2>Fund account</h2>
        <br />
        <Row>
          <Col>Balance: {bal} {standardUnit}</Col>
        </Row>
        <hr />
        <Row>
          <Col>Would you like to fund your account with additional {standardUnit}?</Col>
        </Row>
        <br />
        <Row>
          <Col>(This only works on certain devnets)</Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form.Label htmlFor="fundAccount">Fund Account</Form.Label>
            <Form.Control type="number" id="fundAccount" aria-describedby="fundAccount"
              placeholder={defaultDuration}
              onChange={(e) => this.setState({duration: e.currentTarget.value})}>
            </Form.Control>
        </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" onClick={() => parent.fundAccount(amt)}>Fund Account</Button>
          </Col>
          <Col>
            <Button variant="secondary" onClick={() => parent.skipFundAccount()}>Skip</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

exports.DeployerOrAttacher = class extends React.Component {
  render() {
    const {parent} = this.props;
    return (
      <div>
        Please select a role:
        <br />
        <p>
          <Button variant="primary"
            onClick={() => parent.selectDeployer()}
          >Project Creator (Deployer)</Button>
          <br /> Create a project. Deploy the contract.
        </p>
        <p>
          <Button variant="info"
            onClick={() => parent.selectAttacher()}
          >Project Funder (Attacher) </Button>
          <br /> Attach to the Deployer's contract. Fund the project.
        </p>
      </div>
    );
  }
}

export default exports;