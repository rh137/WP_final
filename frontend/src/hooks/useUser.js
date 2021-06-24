import { useState } from "react";

const useUser = () => {
    const [userInfo, setUserInfo] = useState([]);            //get user info

    const signIn = (account, password) => {
        let nickname;
        let friendList = ["Linda", "Irene"];
        let eventList =[];

        //success &  get userInfo (nickname / account / password / friendList / eventList)
        const newUserInfo = [...userInfo];
        newUserInfo.push({nickname, friendList, eventList});
        console.log(newUserInfo);
        setUserInfo(newUserInfo);
        console.log(userInfo);
        
        //fail(account / password)
    }

    const signUp = (nickname, account, password) => {
        console.log(nickname, account, password)

        //success

        //fail(account / password)
    }

    //缺addFriend
    const addFriend = (account ) => {

    }

    return{userInfo, signIn, signUp}
}

export default useUser;