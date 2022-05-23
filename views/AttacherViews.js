import React from 'react';
import UserViews from './UserViews';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
      <Container>
        <Row>
          <Col>Please paste the contract info to attach to:</Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="ControlTextarea1">
              <Form.Label></Form.Label>
              <Form.Control as="textarea" 
                rows="{3}" 
                onChange={(e) => this.setState({ctcInfoStr: e.currentTarget.value})}
                placeholder='{}' />
            </Form.Group>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Button variant="primary"
              disabled={!ctcInfoStr}
              onClick={() => parent.attach(ctcInfoStr)}>Attach</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

exports.Attaching = class extends React.Component {
  render() {
    return (
      <Alert key="warning" variant="warning">
        Attaching, please wait...
      </Alert>
    );
  }
}

exports.AcceptTerms = class extends React.Component {
  render() {
    const {projectName, amountNeeded, amountFunded, amountFundMessage, standardUnit, parent} = this.props;
    const {disabled} = this.state || {};
    const fundLimit = amountNeeded - amountFunded;
    return (
      <Container>
        <Row>
          <Col>
            The terms are:
          </Col>
        </Row>
        <Row>
          <Col>Project: {projectName}</Col>
        </Row>
        <Row>
          <Col>Project Needs: {fundLimit} {standardUnit} to reach goal.</Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form.Label htmlFor="amountToFund">Amount to Fund ({standardUnit})</Form.Label>
            <Form.Control type="number" id="amountToFund" aria-describedby="amountToFund"
              onChange={(e) => parent.setAmountToFund(e.currentTarget.value, fundLimit)}>
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <b>{amountFundMessage}</b>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Button variant="primary"
              disabled={disabled}
              onClick={() => {
              this.setState({disabled: true});
              parent.termsAccepted();
            }}>Fund project</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

exports.ProjectFunded = class extends React.Component {
  // show name how much it's funded/how much more to fund
  render() {
    const {projectName, amountNeeded, amountFunded, amountToFund, standardUnit} = this.props;
    const fundingStatus = amountNeeded == amountToFund ? "COMPLETE" : "INCOMPLETE";
    console.log(fundingStatus);
    console.log(amountFunded);
    console.log(amountToFund);
    return (
      <Container>
        <Row>
          <Col>You have funded the project: {projectName}</Col>
        </Row>
        <br />
        <Row>
          <Col>Project needs: {amountNeeded} {standardUnit}</Col>
        </Row>
        <Row>
          <Col>You funded: {amountToFund}</Col>
        </Row>
        <br />
        {/* <Row>
          <Col>Project already funded: {amountFunded}</Col>
        </Row> */}
        <br />
        <br />
        <Row>
          <Col>Funding Status: {fundingStatus}</Col>
        </Row>
      </Container>
    );
  }
}

export default exports;