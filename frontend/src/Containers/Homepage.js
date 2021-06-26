import { useState } from "react";
import { Layout, Menu, Card, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, NotificationOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import "../App.css";
import EventPage from "./EventPage";
import NewEventModal from "../Components/NewEventModal";
import AddFriendModal from "../Components/AddFriendModal";
import { setDate } from "date-fns";


const {Sider, Content } = Layout;
const { SubMenu } = Menu;

const Homepage = ({account, nickname, friends, events, setFriends, setEvents, server, displayStatus}) => {
    const [eventCreated, setEventCreated] = useState(false);
    const [eventModalVisible, setEventModalVisible] = useState(false);      
    const [friendModalVisible, setFriendModalVisible] = useState(false);      
    
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    



    const addEvent = () => setEventModalVisible(true);
    const addFriend = () => setFriendModalVisible(true);

    return(
        <>
            {eventCreated ? (
                <EventPage 
                    setEventCreated={setEventCreated}
                    startDate={startDate}
                    endDate={endDate}
                    startTime={startTime}
                    endTime={endTime}
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
                        padding: "1vh"}}
                    > 
                        <Menu
                            mode="inline"
                            style={{ height: '100%', borderRight: 0, fontSize: "20px"}}
                        >
                            <Menu.Item key="Title" style={{cursor: "default"}}><h1>{nickname}'s when2meet</h1></Menu.Item>
                            
                            <SubMenu key="Information" icon={<UserOutlined />} title="個人資訊">
                                <Menu.Item key="8">Account: {account}</Menu.Item>
                            </SubMenu>
                            
                            <Menu.Item key="NewEvent" icon={<NotificationOutlined />} onClick={addEvent} >發起活動</Menu.Item>
                            
                            <SubMenu key="FriendList" icon={<TeamOutlined />} title="好友列表">
                                {friends.map(({account, nickname}) => (
                                    <Menu.Item key={account}>{nickname}</Menu.Item>
                                ))}

                            </SubMenu>
                            
                            <Menu.Item key="AddFriend" icon={<UsergroupAddOutlined />} onClick={addFriend}>加好友</Menu.Item>
                        </Menu>
                    </Sider>

                    <NewEventModal
                        visible={eventModalVisible}
                        onCreate={(value) => {
                            
                            console.log(value);

                            //string to Date
                            setStartDate(new Date(value.date_range[0].format('YYYY-MM-DD')));
                            setEndDate(new Date(value.date_range[1].format('YYYY-MM-DD')));
                            
                            if (parseFloat(value.time_range[0].format('HH.mm')) % 1 !== 0){
                                setStartTime(parseInt(value.time_range[0].format('HH.mm'))/1 + 0.5);
                                console.log(startTime);
                            }
                            setEndTime(parseFloat(value.time_range[1].format('HH.mm')));
                            if (parseFloat(value.time_range[1].format('HH.mm')) % 1 !== 0){
                                setEndTime(parseInt(value.time_range[1].format('HH.mm'))/1 + 0.5);
                                console.log(endTime);
                            }
                            /*
                            //NewEvent()
                            server.send(JSON.stringify({
                                type: "NewEvent",
                                args: { 
                                    title: value.title,
                                    description: value.description,
                                    startDate: new Date(value.date_range[0].format('YYYY-MM-DD')),
                                    endDate: new Date(value.date_range[1].format('YYYY-MM-DD')),
                                    startTime:parseFloat(value.time_range[0].format('HH.mm')),
                                    endTime: parseFloat(value.time_range[1].format('HH.mm')),
                                    participants: [{
                                        account: String                         //revise later
                                    }],
                                    launcher: {
                                        account: account
                                    }
                                }
                            }));
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
                        onCreate={(value) => {
                            console.log(value.friend)           //array
                            /*
                            plan1 - use select
                            for(let i = 0; i < value.friend.length; i++){
                                server.send(JSON.stringify({
                                    type: "AddFriend",
                                    args: {
                                        adderAccount: account,
                                        addedAccount: value.friend.account          //need revise
                                    }
                                }));
                            }

                            plan2 - use input
                            server.send(JSON.stringify({
                                type: "AddFriend",
                                args: {
                                    adderAccount: account,
                                    addedAccount: value.friend.account          //need revise
                                }
                            }));
                            */
                            

                            setFriendModalVisible(false);                       //delete later
                        }}
                        onCancel={() => {
                            setFriendModalVisible(false);
                        }}
                    />

                    <Content className="EventBlock"     
                        style={{padding: 24, marginLeft: "40vh", height:"100vh"}}
                    >
                        <h1 style={{fontWeight: "bolder"}}>活動總覽</h1>
                        {(events.length === 0)?(
                            <>
                                <p style={{fontSize:18}}>目前尚無參加的活動</p>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Card title="title" bordered={false} style={{ width: "60vh", height: "30vh"}}>
                                            <ul>
                                                <li>description: "description"</li>
                                                <li>Date: "startDate" </li>
                                                <li>Time: "startTime"</li>
                                            </ul>
                                        </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card title="title" bordered={false} style={{ width: "60vh", height: "30vh"}}>
                                            <ul>
                                                <li>description: "description"</li>
                                                <li>Date: "startDate" </li>
                                                <li>Time: "startTime"</li>
                                            </ul>
                                        </Card>
                                    </Col>
                                </Row>
                                
                            </>
                        ):(
                            




                            
                            events.map(({title, description, startDate, endDate, startTime, endTime}, i) => (
                                <Row gutter={16} style={{marginTop: 20}}>
                                    <Col span={6} offset={2}>
                                        <Card title={title} bordered={false} style={{ width: "60vh", height: "30vh"}}>
                                            <ul>
                                                <li>description: {description}</li>
                                                <li>Date: {startDate} ~ {endDate} </li>
                                                <li>Time: {startTime} ~ {endTime}</li>
                                            </ul>
                                        </Card>
                                    </Col>
                                    <Col span={6} offset={4}>
                                        <Card title="title" bordered={false} style={{ width: "60vh", height: "30vh" }}>
                                            <ul>
                                                <li>description: {description}</li>
                                                <li>Date: {startDate} ~ {endDate} </li>
                                                <li>Time: {startTime} ~ {endTime}</li>
                                            </ul>
                                        </Card>
                                    </Col>
                                </Row>
                            ))

                        )}
                        
                                               
                        

                    </Content>
                </Layout>
            )
        }


        </>

        
    )}

export default Homepage;