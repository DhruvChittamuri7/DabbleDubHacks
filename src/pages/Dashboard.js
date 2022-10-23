import '../Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import ListGroup from 'react-bootstrap/ListGroup';
import { format } from 'date-fns';
import React, { useState } from 'react';
import {gapi} from 'gapi-script';
import {db} from '../index';

class Dashboard extends React.Component {
    constructor(props) {
      super(props);
    
      this.state = {
        friends: [],
        friendData: [], 
        tasks: [],
        email: null,
        name: null,
        image: null
      }
      this.handleHover = this.handleHover.bind(this);
      this.addTask = this.addTask.bind(this);
      this.addFriend = this.addFriend.bind(this);
      this.changeActiveTask = this.changeActiveTask.bind(this);
      this.clientId = '1009792798284-51ghq4cjo0nfl1icv3edui7b51arbfo9.apps.googleusercontent.com'
      const initClient = () => {
        // gapi.client.init({
        // clientId:this.clientId,
        // scope:' '
        // })
        gapi.auth2.init({
            client_id: '1009792798284-51ghq4cjo0nfl1icv3edui7b51arbfo9.apps.googleusercontent.com',
            scope: "profile email" // this isn't required
        }).then((auth2) => {
            console.log( "signed in: " + auth2.isSignedIn.get() );  
            const email = auth2.currentUser.get().getBasicProfile().getEmail();
            const name = auth2.currentUser.get().getBasicProfile().getName();
                console.log( "current user: " +  email );
                this.setState({email: email, name: name})
                db.collection("users").doc(email).get().then((doc) => {
                    const document = doc.data();
                    console.log(document)
                    this.setState({image: document["image"], friends: document["friends"], taskids: document["tasks"]})
                    console.log(document["tasks"])
                    Promise.all(document["tasks"].map((taskId) => {
                        const y = db.collection('tasks').doc(taskId).get().then((doc) => doc.data())
                        console.log(y)
                        return y;
                    })).then((x) => {
                        this.setState({tasks: x})
                        console.log(x)
                        
                        Promise.all(document["friends"].map((friendEmail) => {
                            const y = db.collection('users').doc(friendEmail).get().then((doc) => {
                                const friendData= doc.data()
                                return {
                                    "name": friendData["name"], 
                                    "pfp": friendData["image"], 
                                    "time-elapsed": "1.5 hours",
                                    "task-name": friendData["current_task"]
                                    }
                            })
                            console.log(y)
                            return y;
                        })).then((x) => {
                            this.setState({friendData: x})
                            console.log(x)
                        })
                    })
                })
            
        });
      }
      gapi.load('client:auth2', initClient)
      
    }
    handleHover(taskNum) {
      let tasks = [...this.state.tasks];
      let task = {...tasks[taskNum]}
      task.shown = !task.shown;
      tasks[taskNum] = task;
      this.setState({
        tasks: tasks
      })

      
    }

    addTask() {
        let taskName = prompt("What is your task");
        if (!taskName) {
            return;
        }
        console.log(this.state.tasks[0])
        const tasksRef = db.collection('tasks')
        tasksRef.add({
            owner: this.state.email,
            task: taskName,
            date: new Date(),
            status: "not started"
          }).then((docRef) => {
            console.log("created this task")
            const usersRef = db.collection('users').doc(this.state.email)
            this.state.taskids.push(docRef.id)
            console.log(this.state.taskids )
            usersRef.set({
                tasks: this.state.taskids 
            }, { merge: true }).then(() => {
                this.setState({taskids: this.state.taskids})
                Promise.all(this.state.taskids.map((taskId) => {
                    const y = db.collection('tasks').doc(taskId).get().then((doc) => doc.data())
                    console.log(y)
                    return y;
                })).then((x) => {
                    this.setState({tasks: x})
                    console.log(x)
                })
            })
          })// create the document
    }
    
    addFriend() {
        let friendEmail = prompt("What is your email");
        const usersRef = db.collection('users').doc(this.state.email)
        this.state.friends.push(friendEmail)
        usersRef.set({
            friends: this.state.friends
        }, {merge: true}).then(() => {
            db.collection('users').doc(friendEmail).get().then((doc)=>{
                const friendData = doc.data();
                
                this.state.friendData.push({
                "name": friendData["name"], 
                "pfp": friendData["image"], 
                "time-elapsed": "1.5 hours",
                "task-name": friendData["current_task"]
                })
                this.setState({friendData:this.state.friendData})
            })
            
        })
    }

    changeActiveTask(i, total) {
        for (let j = 0; j < total; j++) {
            if (i == j) {

                document.getElementById("task"+j).style.backgroundColor= "#90EE90";
            }
                else {

                    document.getElementById("task"+j).style.backgroundColor= "";
                }
            
        }
        console.log(this.state.tasks[i])
        db.collection('users').doc(this.state.email).set({current_task: this.state.tasks[i]["task"]}, {merge: true})
    }
  
    render() { return (
      <Container id="outerContainer">
      <br></br>
      <br></br>
      <Row>
        <Col className="third" align="center" id="profileContainer" sm>
          <img src={this.state.image} className="profile-pic"/>
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
                onMouseEnter={() => this.handleHover(index)} onClick={() => this.changeActiveTask(index, this.state.tasks.length)}>
                  <ListGroup.Item id={"task" + index} className="task">{task['task']} (Due: {task['due-date']})</ListGroup.Item>
                  {task["shown"] && <div className="task-overlay">working.</div>}
                </div>
              )
            })}
          </ListGroup>
          <br></br>
          <Button as="a" variant="primary" onClick={this.addTask}>
            Add task
          </Button>
        </Col>
        <Col className="third" align="center" sm >
          <h3>Your friends</h3>
          <br></br>
          <ListGroup id="friendStatuses">
            {this.state.friendData.map((item) => {
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
                      (<span className= "time-elapsed">{item['date']}</span>)
                    </span>
                  </Col>
                </Row>
              
              
            </ListGroup.Item>)
            })}
            
          </ListGroup>
          <br></br>
          <Button as="a" variant="primary" onClick={this.addFriend}>
            Add friend
          </Button>
        </Col>
      </Row>
      <br></br>
      <Row><Col align="center">
            <GoogleLogout
              clientId={this.clientId}
              buttonText="Log Out"
              align="center"
              onLogoutSuccess={() => {window.location.href = "http://localhost:3000"}}
              /></Col></Row>
    </Container>
    );
          }
  }
  
  export default Dashboard;