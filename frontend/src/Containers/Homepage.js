import { useState } from "react";
import { Layout, Menu, Card, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, NotificationOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import "../App.css";
import EventPage from "./EventPage";
import NewEventModal from "../Components/NewEventModal";
import AddFriendModal from "../Components/AddFriendModal";


const {Sider, Content, Header } = Layout;
const { SubMenu } = Menu;

const Homepage = ({account, nickname, friends, events, setFriends, setEvents, server, displayStatus}) => {
    server.onmessage = (m) => {
        onEvent(JSON.parse(m.data));
    };
    const onEvent = (e) => {
        const { type } = e;
        switch (type) {
            case 'AddFriend': {
                const {success} = e.result;
                if(success === true){
                    displayStatus({
                        type: "success",
                        msg: "Add friend successfully.",
                    });
                    setFriends().push(e.data.newFriend);
                    setFriendModalVisible(false);
                }
                else{
                    displayStatus({
                        type: "error",
                        msg: e.result.errorType,
                    })
                }
                break;
            }

            case 'NewEvent': {
                const {success} = e.result;
                if(success === true){
                    setTitle(e.data.title);
                    setDescription(e.data.description);
                    setStartDate(e.data.startDate);
                    setEndDate(e.data.endDate);
                    setStartTime(e.data.startTime);
                    setEndTime(e.data.endTime);
                    setParticipants(e.data.participants);
                    setLauncher(e.data.launcher);
                    setID(e.data._id);
                    
                    console.log(e.data)
                    setEventModalVisible(false);
                    displayStatus({
                        type: "success",
                        msg: "New event successfully.",
                    });
                    setEventCreated(true);
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
    }

    const [eventCreated, setEventCreated] = useState(false);
    const [eventModalVisible, setEventModalVisible] = useState(false);      
    const [friendModalVisible, setFriendModalVisible] = useState(false);      
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [participants, setParticipants] = useState([]);
    const [launcher, setLauncher] = useState();
    const [id, setID] = useState();
    
    const addEvent = () => setEventModalVisible(true);
    const addFriend = () => setFriendModalVisible(true);
    const enterEvent = () => setEventCreated(true);
    //for event block render
    const divideGroup = (arr) => {                                  
        const len = Math.ceil(arr.length/2)
        let ret = []
        for (let i = 0; i < len; i++){
          ret.push(arr.slice(i*2, (i+1)*2));
        }
        return ret;
    }
    let eventGroup = divideGroup(events);
    console.log(eventGroup);
    return(
        <>
            {eventCreated ? (
                <EventPage 
                    setEventCreated={setEventCreated}
                    account={account}
                    title={title}
                    description={description}
                    startDate={startDate}
                    endDate={endDate}
                    startTime={startTime}
                    endTime={endTime}
                    participants={participants}
                    launcher={launcher}
                    id={id}
                    setParticipants={participants}
                    server={server}
                    displayStatus={displayStatus}
                />
            ):(
                <Layout className="App-homepage" >
                    <Sider 
                        width={"40vh"}
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
                        friends={friends}
                        visible={eventModalVisible}
                        onCreate={(value) => {                           
                            console.log(value);

                            if(value.description === undefined){
                                value.description = "";
                            }
                            
                            //turn XX.3 to XX.5 for ScheduleSelector time format
                            if (parseFloat(value.time_range[0].format('HH.mm')) % 1 !== 0)
                                value.time_range[0] = parseFloat(value.time_range[0].format('HH.mm')) + (0.5-0.3);
                            else
                                value.time_range[0] = parseFloat(value.time_range[0].format('HH.mm'));
                            if (parseFloat(value.time_range[1].format('HH.mm')) % 1 !== 0)
                                value.time_range[1] = parseFloat(value.time_range[1].format('HH.mm')) + (0.5-0.3);
                            else
                                value.time_range[1] = parseFloat(value.time_range[1].format('HH.mm'));
                            
                            value.participants.push(account);
                            for(let i = 0; i < value.participants.length; i++){
                                console.log(value.participants[i]);
                            }

                            server.send(JSON.stringify({
                                type: "NewEvent",
                                args: { 
                                    title: value.title,
                                    description: value.description,
                                    startDate: new Date(value.date_range[0].format('YYYY-MM-DD')),
                                    endDate: new Date(value.date_range[1].format('YYYY-MM-DD')),
                                    startTime: value.time_range[0],
                                    endTime: value.time_range[1],
                                    participants: [
                                        {account: value.participants.map((i) => (
                                            i
                                        ))}
                                        /*
                                        value.participants.map((i) => (
                                            {account: i}
                                        ),)*/
                                    ],
                                    /*participants: [
                                        {account: value.participants}],*/
                                    launcher: {
                                        account: account
                                    }
                                }
                            }));
                            
                        }}
                        onCancel={() => {
                            setEventModalVisible(false);
                        }}
                    />
                    <AddFriendModal
                        visible={friendModalVisible}
                        onCreate={(value) => {
                            console.log(value.friendAccount)
                            server.send(JSON.stringify({
                                type: "AddFriend",
                                args: {
                                    adderAccount: account,
                                    addedAccount: value.friendAccount 
                                }
                            }));  
                        }}
                        onCancel={() => {
                            setFriendModalVisible(false);
                        }}
                    />

                    <Layout className="site-layout" style={{overflow:"scroll"}}>
                        <Content className="EventBlock site-layout-background"     
                            style={{padding: 24, marginLeft: "45vh", height:"100vh"}}
                        >
                            <h1 style={{fontWeight: "bolder"}}>活動總覽</h1>
                            {(events.length === 0)?(
                                <p style={{fontSize:18}}>目前尚無參加的活動</p>
                            ):(
                                eventGroup.map((i) => (
                                    <Row gutter={16} style={{marginTop: 20}}>
                                        {i.map(({title, description, startDate, endDate, startTime, endTime, participants, launcher, _id}) => (
                                            <Col span={12}>
                                            <Card title={title} bordered={false} style={{ width: "60vh", height: "30vh", cursor:"pointer"}} 
                                                onClick={
                                                 
                                                   
                                                    enterEvent
                                                }>
                                                <ul>
                                                    {(description.length === 0)?(null):(<li>Description: {description}</li>)}
                                                    <li>Date: {(startDate.length > 10)? startDate.slice(0,10):null} ~ {(endDate.length > 10)? endDate.slice(0,10):null}</li>
                                                    <li>Launcher: {launcher.nickname}</li>
                                                </ul>
                                            </Card>
                                        </Col>
                                        ))}
                                    </Row>
                                ))
                            )}  

                        </Content>
                    </Layout>
                       
                </Layout>
            )
        }
        </>
        
    )}

export default Homepage;