import React from 'react';
import UserViews from './UserViews';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
    const {parent, defaultDuration, standardUnit} = this.props;
    const amountNeeded = (this.state || {}).amountNeeded;
    const duration = (this.state || {}).duration || defaultDuration;
    return (
      <Container>
        <Row>
          <Col>
            <Form.Label htmlFor="projectName">Name</Form.Label>
            <Form.Control type="text" id="projectName" aria-describedby="projectName"
                onChange={(e) => this.setState({projectName: e.currentTarget.value})}>
            </Form.Control>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label htmlFor="duration">Duration</Form.Label>
            <Form.Control type="number" id="duration" aria-describedby="duration"
                  placeholder={defaultDuration}
                  onChange={(e) => this.setState({duration: e.currentTarget.value})}>
            </Form.Control>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label htmlFor="amountNeeded">Amount Needed ({standardUnit})</Form.Label>
            <Form.Control type="number" id="amountNeeded" aria-describedby="amountNeeded"
                  onChange={(e) => this.setState({amountNeeded: e.currentTarget.value})}>
            </Form.Control>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Button variant="primary"
                onClick={() => parent.setProjectDetails(projectName, duration, amountNeeded)}
              >Set Project Details</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

exports.Deploy = class extends React.Component {
  render() {
    const {parent, projectName, duration, amountNeeded, standardUnit} = this.props;
    return (
      <Container>
        <Row>
          <Col>
            Project: {projectName}
          </Col>
        </Row>
        <br  />
        <Row>
          <Col>
            Duration: {duration}
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            Amount Needed: <strong>{amountNeeded}</strong> {standardUnit}
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Button variant="primary" onClick={() => parent.deploy()}>Deploy</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

exports.Deploying = class extends React.Component {
  render() {
    return (
      <Alert key="warning" variant="warning">
        Deploying, please wait...
      </Alert>
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
        <Alert key="warning" variant="warning">Waiting for Project to be funded ..</Alert>
        Please give funders this contract info:
        <pre className='ContractInfo'>
          {ctcInfoStr}
        </pre>
        <Button variant="primary"
          onClick={(e) => this.copyToClipboard(e.currentTarget)}
        >Copy to clipboard</Button>
      </div>
    )
  }
}

export default exports;