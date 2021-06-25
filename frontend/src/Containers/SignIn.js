import { useState } from "react";
import { Input, Form, Button} from "antd";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, LockOutlined} from "@ant-design/icons";
import "../App.css";
import SignUpModal from "../Components/SignUpModal";

const SignIn = ({account, password, setSignedIn, setAccount, setPassword, setNickname, setFriends, setEvents, server, displayStatus}) => {
    server.onmessage = (m) => {
        onEvent(JSON.parse(m.data));
    };
    const onEvent = (e) => {
        const { type } = e;
        switch (type) {
          case 'SignUp': {
            const {success} = e.data;
            if(success === true){
                displayStatus({
                    type: "success",
                    msg: "Sign up successfully.",
                });
                setModalVisible(false);
            }
            else{
                displayStatus({
                    type: "error",
                    msg: e.data.errorType,
                })
            }
            break;
          }
          case 'SignIn': {
            //finish yet
            const { success} = e.data;
            if(success === true){
                setNickname(e.data.nickname);
                setFriends(e.data.friends);
                setEvents(e.data.events);
                setSignedIn(true);
            }
            else{
                displayStatus({
                    type: "error",
                    msg: e.data.errorType,
                })
            }

            break;
          }
        }
    };

    const onFinish = () => {
        console.log('Received values of form: ', account, password);
        /*
        server.send(JSON.stringify({
            type: "SignIn",
            args: {
                account: account,
                password: password,
            }
        }));        
        */

        setSignedIn(true);              //for test(要註解掉)
    };
    
    const [modalVisible, setModalVisible] = useState(false);
    const addUser = () => setModalVisible(true);
    
    const tailLayout = {
        wrapperCol: { offset: 4, span: 16 },
    };
    
    return (
        <div className="App-signIn">
            <div className="App-title"><h1>when2meet fake</h1></div>
            <Form
                name="normal_login"
                style={{ width: 300 }}
                layout="vertical"
                onFinish={onFinish}
                >
                <Form.Item
                    name="account"
                    label="帳號"
                    rules={[{ required: true, message: 'Please input your Account Number!' }]}
                >
                    <Input 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Account"
                        size="large"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密碼："
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        type="password"
                        placeholder="Password"
                        size="large"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button htmlType="submit" type="primary" size="large">Sign In</Button>
                    <Button htmlType="button" style={{ margin: '0 8px'}} size="large" onClick={addUser}>Sign Up</Button>
                </Form.Item>
            </Form>
            
            <SignUpModal
                visible={modalVisible}
                onCreate={(value) => {                                  //nickname, account, password
                    console.log(value.nickname, value.account, value.password);
                    
                    server.send(JSON.stringify({
                        type: "SignUp",
                        args: {
                            account: value.account,
                            password: value.password,
                            nickname: value.nickname
                        }
                    }));
                }}
                onCancel={() => {
                    setModalVisible(false);
                }}
                
            />
        </div>

    );
}

export default SignIn;