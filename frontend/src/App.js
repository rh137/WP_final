import './App.css';
import React, {useState, useEffect} from "react";
import { message } from 'antd';
import SignIn from "./Containers/SignIn";
import Homepage from "./Containers/Homepage";

let HOST = window.location.origin.replace(/^http/, 'ws')
let server = new WebSocket(HOST);

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [account, setAccount] = useState("");             
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [friends, setFriends] = useState([]);
  const [events, setEvents] = useState([]);

  const displayStatus = (payload) => {
    if (payload.msg) {
      const { type, msg } = payload
      const content = {
        content: msg, duration: 0.5 }
      switch (type) {
        case 'success':
          message.success(content)
          break
        case 'error':
        default:
          message.error(content)
          break
  }}}
  /*
  useEffect(() => {
    displayStatus(status)}, [status]);

  */
  server.onopen = () => console.log('Server connected.');

  return (
    <div className="App">
      {signedIn ? (
        <Homepage
          account={account}
          nickname={nickname}   
          friends={friends}
          events={events}
          setFriends={setFriends}
          setEvents={setEvents}
          server={server}
          displayStatus={displayStatus}

        />
      ):(
        <SignIn       
          account={account} 
          password={password} 
          setSignedIn={setSignedIn}
          setAccount={setAccount} 
          setPassword={setPassword}
          setNickname={setNickname}
          setFriends={setFriends}
          setEvents={setEvents}
          server={server}
          displayStatus={displayStatus}
        />
      )}
    </div>
  );
}

export default App;
