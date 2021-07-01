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
            const {success} = e.result;
            if(success === true){
                displayStatus({
                    type: "success",
                    msg: "Sign up successfully！",
                });
                setModalVisible(false);
            }
            else{
                displayStatus({
                    type: "error",
                    msg: e.result.errorType,
                })
            }
            break;
          }
          case 'SignIn': {
            const { success} = e.result;
            if(success === true){
                displayStatus({
                    type: "success",
                    msg: "Sign in successfully！",
                })
                setNickname(e.data.nickname);
                setFriends(e.data.friends);
                setEvents(e.data.events);
                setSignedIn(true);
            }
            else{
                displayStatus({
                    type: "error",
                    msg: e.result.errorType,
                })
            }
            break;
          }
        }
    };

    const onFinish = () => {
        console.log('Received values of form: ', account, password);
        
        server.send(JSON.stringify({
            type: "SignIn",
            args: {
                account: account,
                password: password,
            }
        }));        
        
    };
    
    const [modalVisible, setModalVisible] = useState(false);
    const addUser = () => setModalVisible(true);
    
    const tailLayout = {
        wrapperCol: { offset: 4, span: 16 },
    };
    
    return (
        <div className="App-signIn">
            <div className="App-title"><h1>Let's Meet!</h1></div>
            <Form
                name="normal_login"
                style={{ width: 300 }}
                layout="vertical"
                onFinish={onFinish}
                >
                <Form.Item
                    name="account"
                    label="帳號"
                    rules={[{ required: true, message: 'Error: 請輸入帳號！' }]}
                >
                    <Input 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="請輸入您的帳號"
                        size="large"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密碼："
                    rules={[{ required: true, message: 'Error: 請輸入密碼！' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        type="password"
                        placeholder="請輸入您的密碼"
                        size="large"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item {...tailLayout}>
                  <div>

                    <Button htmlType="button" style={{'margin-left': '15px' }} size="large" onClick={addUser}>註冊</Button>
                    <Button htmlType="submit" style={{'float': 'right', 'margin-right': '15px'}} type="primary" size="large">登入</Button>
                  </div>
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
                onCancel={() => {setModalVisible(false);}}  
            />
        </div>

    );
}

export default SignIn;