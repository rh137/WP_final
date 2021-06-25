import { useState } from "react";
import { Layout, Menu, Card, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, NotificationOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import "../App.css";
import EventPage from "./EventPage";
import NewEventModal from "../Components/NewEventModal";
import AddFriendModal from "../Components/AddFriendModal";
//import useEvent from '../hooks/useEvent';

const {Sider, Content } = Layout;
const { SubMenu } = Menu;

const Homepage = ({account, nickname, friends, events, setFriends, setEvents, server, displayStatus}) => {
    //const {eventInfo, newEvent} = useEvent();
    const [eventCreated, setEventCreated] = useState(false);
    const [eventModalVisible, setEventModalVisible] = useState(false);      
    const [friendModalVisible, setFriendModalVisible] = useState(false);      
    
    const addEvent = () => setEventModalVisible(true);
    const addFriend = () => setFriendModalVisible(true);

    return(
        <>
            {eventCreated ? (
                <EventPage 
                    setEventCreated={setEventCreated}
                />
            ):(
                <Layout className="App-homepage" >
                    <Sider 
                        width={300}
                        style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        backgroundColor: "white",
                        padding: "1vh"
                    }}> 
                        
                        <Menu
                            mode="inline"
                            //defaultSelectedKeys={['1']}
                            //defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0, fontSize: "20px"}}
                        >

                            <Menu.Item key="Title" style={{cursor: "default"}}><h1>{nickname}'s when2meet</h1></Menu.Item>
                            
                            <SubMenu key="Information" icon={<UserOutlined />} title="個人資訊">
                                <Menu.Item key="8">XXXX</Menu.Item>
                            </SubMenu>
                            
                            <Menu.Item key="NewEvent" icon={<NotificationOutlined />} onClick={addEvent} >發起活動</Menu.Item>
                            
                            <SubMenu key="FriendList" icon={<TeamOutlined />} title="好友列表">
                                <Menu.Item key="9">option9</Menu.Item>
                                <Menu.Item key="10">option10</Menu.Item>
                                <Menu.Item key="11">option11</Menu.Item>
                                <Menu.Item key="12">option12</Menu.Item>
                            </SubMenu>
                            
                            <Menu.Item key="AddFriend" icon={<UsergroupAddOutlined />} onClick={addFriend}>加好友</Menu.Item>
                        </Menu>
                    </Sider>

                    <NewEventModal
                        visible={eventModalVisible}
                        onCreate={(value) => {
                            //console.log(value)
                            console.log(value.date_range[0].format('MM/DD'), 
                            value.date_range[1].format('MM/DD'), 
                            parseFloat(value.time_range[0].format('HH.mm')),
                            parseFloat(value.time_range[1].format('HH.mm'))
                            );
                            //use hook to send eventInfo to backend
                            /*
                            newEvent(account, 
                                    value.title, 
                                    value.description, 
                                    value.date_range[0].format('MM/DD'), 
                                    value.date_range[1].format('MM/DD'), 
                                    value.time_range[0].format('HH.mm'),
                                    value.time_range[1].format('HH.mm'), 
                                    value.participant);
                            */
                            setEventModalVisible(false);
                            setEventCreated(true);
                        }}
                        onCancel={() => {
                            setEventModalVisible(false);
                        }}
                    />
                    <AddFriendModal
                        visible={friendModalVisible}
                        onCreate={() => {
                            setFriendModalVisible(false);
                        }}
                        onCancel={() => {
                            setFriendModalVisible(false);
                        }}
                    />

                    <Content className="EventBlock"     
                        style={{padding: 24, marginLeft: 300, height:"100vh"}}
                    >
                        <h1>活動總覽</h1>
                        <Row gutter={16} style={{marginTop: 20}}>
                            <Col span={6} offset={2}>
                                <Card title="Card title" bordered={false} style={{ width: 500, height: 200}}>
                                    <p>description</p>
                                </Card>
                            </Col>
                            <Col span={6} offset={4}>
                                <Card title="Card title" bordered={false} style={{ width: 500, height: 200 }}>
                                    <p>description</p>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={16} style={{marginTop: 20}}>
                            <Col span={6} offset={2}>
                                <Card title="Card title" bordered={false} style={{ width: 500, height: 200}}>
                                    <p>description</p>
                                </Card>
                            </Col>
                            <Col span={6} offset={4}>
                                <Card title="Card title" bordered={false} style={{ width: 500, height: 200 }}>
                                    <p>description</p>
                                </Card>
                            </Col>
                        </Row>
                        

                    </Content>
                </Layout>
            )
        }


        </>

        
    )}

export default Homepage;