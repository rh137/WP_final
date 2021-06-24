import { useState } from "react";
import { Input, Form, Button} from "antd";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, LockOutlined} from "@ant-design/icons";
import "../App.css";
import SignUpModal from "../Components/SignUpModal";
import useUser from "../hooks/useUser";

const SignIn = ({account, password, setSignedIn, setAccount, setPassword, setUserInfo}) => {
    const {userInfo, signIn, signUp} = useUser();
    const [modalVisible, setModalVisible] = useState(false);
    const addUser = () => setModalVisible(true);
    
    const tailLayout = {
        wrapperCol: { offset: 4, span: 16 },
    };

    const onFinish = () => {
        console.log('Received values of form: ', account, password);
        signIn(account, password);
        /*
        if(userInfo.length !== 0){
            setNickname(userInfo.nickname);
            setSignedIn(true);
        }
        else{

        }    */
        
        //console.log(userInfo);
        //setUserInfo(userInfo);
        setSignedIn(true);              //for test(要註解掉)
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
                    signUp(value.nickname, value.account, value.password);
                    setModalVisible(false);
                }}
                onCancel={() => {
                    setModalVisible(false);
                }}
                
            />
        </div>

    );
}

export default SignIn;