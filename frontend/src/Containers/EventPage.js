import { useState } from "react";
import ScheduleSelector from 'react-schedule-selector'
import moment from "moment";
import { Layout, Menu,  Row, Col, Button, Divider } from 'antd';
import {TeamOutlined, UserOutlined, DoubleLeftOutlined} from '@ant-design/icons';
import AddFriendModal from "../Components/AddFriendModal";
import ScheduleTable from "../Components/ScheduleTable";
import { mergeTimeSlots, splitTimeSlots } from '../utils/index'

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const EventPage = ({setEnterEvent, account, title, description, startDate, endDate, startTime, endTime, participants, launcher, id, setParticipants, server, displayStatus}) => {
  server.onmessage = (m) => {
    onEvent(JSON.parse(m.data));
  };
  const onEvent = (e) => {
    const { type } = e;
    switch (type) {
      case 'Invite': {
        const {success} = e.result;
        if(success === true){
            displayStatus({
                type: "success",
                msg: "Invite successfully.",
            });       
            let updatedParticipant = [...participants, e.data.newParticipant];
            setParticipants(updatedParticipant);  
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

      case 'UpdateAvailableTimeSlots': {
          const {success} = e.result;     
          if(success === false){
              displayStatus({
                  type: "error",
                  msg: e.result.errorType,
              })
          }
          break;
      }

      case 'GetAvailableTimeSlots': {
        const {success} = e.result;
        if(success === false){
          displayStatus({
            type: "error",
            msg: e.result.type,
          })
        }
        else{
          setTimeSlots(e.data.timeSlots);
          setEditMode(false);
        }
        break;
      }
      
      //undone
      case 'GetMyAvailableTimeSlots': {
        const {success} = e.result;
        if(success === true){ 
          /*let year = parseInt(e.result.date.splice(0,4))
          let month = parseInt(e.result.date.splice(5,7)) -1
          let day = parseInt(e.result.date.splice(8))
        */
          setEditMode(true);      
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

  const [timeSlots, setTimeSlots] = useState([]);                                   //from getAvailableTime()
  const [availableParticipants, setAvailableParticipants] = useState([]);
  const [unavailableParticipants, setUnavailableParticipants] = useState([]);
  const [friendModalVisible, setFriendModalVisible] = useState(false);               //for invite()
  const [editMode, setEditMode] = useState(false);
  const addParticipant = () => setFriendModalVisible(true); 
  const closeEvent = () => setEnterEvent(false);
  //for ScheduleSelector
  const [schedule, setSchedule] = useState([]);             
  const handleChange = newSchedule => {
    setSchedule(newSchedule);
    console.log(schedule);
  }

  const turnEditMode = () => {
    server.send(JSON.stringify({
      type: "GetMyAvailableTimeSlots",
      args: { 
        requesterAccount: account,
        eventId: id,
      }
    }));
    
    setEditMode(true);
  }
  const turnViewMode = () => {
    //UpdateAvailableTimeSlots()
    let availableTime = []                                                //{date, startTime, endTime}
    schedule.map((timeSlot) => {
      let start = parseFloat(moment(timeSlot).format("HH.mm"));           //start time
      if(start % 1 !== 0)
        start = start + (0.5 - 0.3);
      let end = start + 0.5;                                              //end time
      availableTime.push({date: moment(timeSlot).format("YYYY-MM-DD"), startTime: start, endTime: end})
    })
    availableTime = mergeTimeSlots(availableTime);
    console.log(availableTime)
    
    server.send(JSON.stringify({
      type: "UpdateAvailableTimeSlots",
      args: { 
        requesterAccount: account,
        eventId: id,
        availableTimeSlots: availableTime,
      }
    }));

    //GetAvailableTimeSlots()
    server.send(JSON.stringify({
      type: "GetAvailableTimeSlots",
      args: { 
        requesterAccount: account,
        eventId: id
      }
    }));
  }

  //for ScheduleSelector numDays
  var difference_in_time = new Date(endDate).getTime() - new Date(startDate).getTime();
  var difference_in_days = difference_in_time / (1000*3600*24);
  const days = difference_in_days + 1;

    return(
      <Layout className="App-homepage" style={{ minHeight: '100vh' }}>
      <Sider 
        style={{
          overflow: 'auto',
          position: 'fixed',
          height: "100vh",
          left: 0,
          backgroundColor: "white",
      }}>
        <Menu  
          mode="inline"
          style={{fontSize: "18px"}}
        >
          <Menu.Item key="1" icon={<DoubleLeftOutlined />} onClick={closeEvent}>
            返回個人主頁
          </Menu.Item>

          <SubMenu key="sub1" icon={<UserOutlined />} title="活動參加者">
            {participants.map(({nickname, account}) => (                           //change to participants(array not object)
              <Menu.Item key={account}>{nickname}({account})</Menu.Item>
            ))}
          </SubMenu>

          <Menu.Item key="9" icon={<TeamOutlined />} onClick={addParticipant}>
            邀請更多人
          </Menu.Item>
        </Menu>
      </Sider>
      
      <AddFriendModal
        visible={friendModalVisible}
        onCreate={(value) => {
            server.send(JSON.stringify({
              type: "Invite",
              args: {
                  inviterAccount: account,
                  invitedAccount: value.friendAccount,
                  eventId: id
              }
          }));
        }}
        onCancel={() => {setFriendModalVisible(false);}}
      />
      <Layout className="site-layout" style={{overflow:"scroll", padding: 30}}>
        <Content className=""style={{padding: 24, marginLeft: 200, Height:"100vh"}}>
          <Row style={{backgroundColor: "white"}} >
            <Col 
              span={9} 
              style={{padding: 15}}
            >
              <h1 style={{fontWeight: "bold", fontSize:"25px"}}>{title}</h1>
              <ul style={{fontSize: "20px"}}>
                {(description.length === 0)?(null):(<li>活動內容簡述： {description}</li>)}
                <li>活動發起人： {launcher.nickname}</li>
              </ul>
              <Row style={{margin: 5, minHeight: "55vh"}}>
                {(editMode === true)?(
                  <p></p>
                ):(
                  <>
                    <Col span={10} offset={0}>
                      <h1>Available</h1>

                      <ul>
                      {availableParticipants.map(({nickname, account}) => (
                        (account !== undefined)? (
                          <li key={account}>{nickname}({account})</li>
                        ):(
                          <li>這個時段大家都沒空!</li>
                        )                         
                        
                      ))}
                      </ul>

                    </Col>
                    <Col >
                      <Divider 
                        type="vertical" 
                        style={{backgroundColor: "black",  width: 2, height: "52vh", overflow: "hidden"}} 
                      />
                    </Col>
                    <Col span={10} offset={0.5}>
                      <h1>Unavailable</h1>
                      <ul>
                        {unavailableParticipants.map(({nickname, account}) => (
                          (account !== undefined)? (
                            <li key={account}>{nickname}({account})</li>
                          ):(
                            null
                          )
                        ))}
                      </ul>
                    </Col>
                  </>
                )}
                
              </Row>
              <Row style={{marginTop: 20}}>
                {(editMode === true)?(
                  <Button type="primary" size="large" style={{width: "20vh", marginLeft: "23vh", fontSize: "22px"}} onClick={turnViewMode}>瀏覽模式</Button>
                ):(
                  <Button type="primary" size="large" style={{width: "20vh", marginLeft: "23vh", fontSize: "22px"}} onClick={turnEditMode}>編輯模式</Button>
                )
                }
              </Row>
            </Col>

            <Col span={14} style={{ padding: 15, alignSelf:"center", marginRight: "0.5vh"}}>

              {(editMode === true)?(
                <ScheduleSelector
                  onChange={handleChange}
                  selection={schedule}
                  numDays={days}
                  startDate={startDate}           //change to  startDate={new Date(Date.parse(startDate))}
                  minTime={startTime}
                  maxTime={endTime}
                  hourlyChunks={2}
                  timeFormat={"HH:mm"}
                  hoveredColor={"rgba(89, 120, 242, 1)"}
                />
              ):(
                <ScheduleTable 
                  startDate={startDate}
                  endDate={endDate}
                  startTime={startTime}
                  endTime={endTime}
                  timeSlots = {timeSlots}
                  participants = {participants}
                  setAvailableParticipants={setAvailableParticipants}
                  setUnavailableParticipants={setUnavailableParticipants}
                  
                />
              )}
              
            </Col>
          </Row>        
        </Content>
        </Layout>  
    </Layout>
 
    )
    
  }

export default EventPage;