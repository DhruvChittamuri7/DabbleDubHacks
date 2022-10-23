import '../Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { format } from 'date-fns';
import React, { useState } from 'react';
import {gapi} from 'gapi-script';

class Dashboard extends React.Component {
    constructor(props) {
      super(props);
    
      let tasks = [
        {
          "name": "MATH 126",
          "due-date": format(new Date(), "MM/dd, hh:mm a"),
          "shown": false
        },
        {
          "name": "CSE 143",
          "due-date": format(new Date(), "MM/dd, hh:mm a"),
          "shown": false
        },
        {
          "name": "Boobs",
          "due-date": format(new Date(), "MM/dd, hh:mm a"),
          "shown": false
        }
      ];
    
      tasks = Object.keys(tasks).map((key) => {
        return [key, tasks[key]]
      })
    
      tasks.sort(function(first, second) {
        return second[1]['due-date'] - first[1]['due-date']
      })
      this.state = {
        friends: [
          {
            "name": "Aheli", 
            "pfp": "aheli.png", 
            "time-elapsed": "2 hours",
            "task-name": "MATH 126"
          },
          {
            "name": "Sheshank", 
            "pfp": "sheshank.jpg", 
            "time-elapsed": "1.5 hours",
            "task-name": "CSE 311"
          },
        ], 
        tasks: tasks,
        email: null,
        name: null
      }
      this.handleHover = this.handleHover.bind(this);
      this.clientId = '1009792798284-51ghq4cjo0nfl1icv3edui7b51arbfo9.apps.googleusercontent.com'
      

      gapi.load('auth2', () => {
        gapi.auth2.init({
            client_id: '1009792798284-51ghq4cjo0nfl1icv3edui7b51arbfo9.apps.googleusercontent.com',
            scope: "profile email" // this isn't required
        }).then((auth2) => {
            console.log( "signed in: " + auth2.isSignedIn.get() );  
            const email = auth2.currentUser.get().getBasicProfile().getEmail();
            const name = auth2.currentUser.get().getBasicProfile().getName();
            console.log( "current user: " +  email );
            this.setState({email: email, name: name})
        });
    });
      
    }
    handleHover(taskNum) {
      let tasks = [...this.state.tasks];
      let task = {...tasks[taskNum][1]}
      task.shown = !task.shown;
      tasks[taskNum][1] = task;
      this.setState({
        tasks: tasks
      })

      
    }
  
  
    render() { return (
      <Container id="outerContainer">
      <br></br>
      <br></br>
      <Row>
        <Col className="third" align="center" id="profileContainer" sm>
          <img src="http://2.bp.blogspot.com/_RL418eScipM/S1BY8lUpkaI/AAAAAAAAB28/rV1zODmhFPo/s320/Male+Indian2.jpg" className="profile-pic"/>
          <h3>{this.state.name}</h3>
          <h5>{this.state.email}</h5>
          <br></br>
          <Button as="a" variant="secondary">
            Settings
          </Button>
          <Button as="a" variant="secondary">
            Timer
          </Button>
          <Button as="a" variant="secondary">
            Notifications
          </Button>
  
  
  
  
        </Col>
        <Col className="third" align="center" sm>
          <h3>Your tasks</h3>
          <br></br>
          <ListGroup id="tasks">
            {this.state.tasks.map((task, index) => {
              return (
                <div
                onMouseLeave={() => this.handleHover(index)}
                onMouseEnter={() => this.handleHover(index)} >
                
                  <ListGroup.Item className="task">{task[1]["name"]} (Due: {task[1]['due-date']})</ListGroup.Item>
                  {task[1]["shown"] && <div className="task-overlay">working.</div>}
                </div>
              )
            })}
          </ListGroup>
          <br></br>
          <Button as="a" variant="primary">
            Add task
          </Button>
        </Col>
        <Col className="third" align="center" sm >
          <h3>Your friends</h3>
          <br></br>
          <ListGroup id="friendStatuses">
            {this.state.friends.map((item) => {
              return (<ListGroup.Item className="friend-status">
                <Row>
                  <Col xs={3}>
                  
              <img src={item["pfp"]} className="task-pfp"/>
                  </Col>
                  <Col xs={9} align="left">
                    <span className="friend-name">{item["name"]}</span>
                    <br></br>
                    <span className="grey i">
                      Working on&nbsp;
                      <span className= "time-elapsed">{item['task-name']}</span>&nbsp;
                      (<span className= "time-elapsed">{item['time-elapsed']}</span>)
                    </span>
                  </Col>
                </Row>
              
              
            </ListGroup.Item>)
            })}
            
          </ListGroup>
          <br></br>
          <Button as="a" variant="primary">
            Add friend
          </Button>
        </Col>
      </Row>
    </Container>
    );
          }
  }
  
  export default Dashboard;