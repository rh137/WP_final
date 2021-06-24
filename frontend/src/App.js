import './App.css';
import {useState} from "react";
import SignIn from "./Containers/SignIn";
import Homepage from "./Containers/Homepage";

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [account, setAccount] = useState("");             //account for identification
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState([]);

  //console.log(userInfo)

  return (
    <div className="App">
      {signedIn ? (
        <Homepage
                //nickname={nickname}
                account={account}
                password={password}
                //setFriendList={setFriendList}
                //setEventList={setEventList}
                userInfo={userInfo}
        />
      ):(
        <SignIn       
                account={account} 
                password={password} 
                setSignedIn={setSignedIn}
                setAccount={setAccount} 
                setPassword={setPassword} 
                setUserInfo={setUserInfo}
        />
      )}
    </div>
  );
}

export default App;
