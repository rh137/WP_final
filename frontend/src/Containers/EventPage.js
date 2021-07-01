import React from 'react';
import { useState, useEffect } from "react";
import ScheduleSelector from 'react-schedule-selector'
import moment from "moment";
import { Layout, Menu,  Row, Col, Button, Divider } from 'antd';
import {TeamOutlined, UserOutlined, DoubleLeftOutlined} from '@ant-design/icons';
import InviteModal from "../Components/InviteModal";
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
          else{
            displayStatus({
              type: "success",
              msg: "saved",
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
          if(timeSlots.length!= null)
            setEditMode(false);
          setMyTimeSlots([]);
        }
        break;
      }
      
      case 'GetMyAvailableTimeSlots': {
        const {success} = e.result;
        if(success === true){ 
          let timeSlots = splitTimeSlots(e.data.availableTimeSlots);
          myTimeSlotsUpdate(timeSlots);
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

  const [timeSlots, setTimeSlots] = useState([]);                                   //from GetAvailableTimeSlots
  const [myTimeSlots, setMyTimeSlots] = useState([]);                               //for ScheduleSelector (put myTimeSlots)
  const [availableParticipants, setAvailableParticipants] = useState([]);
  const [unavailableParticipants, setUnavailableParticipants] = useState([]);                                 
  const [friendModalVisible, setFriendModalVisible] = useState(false);               //for invite()
  const [editMode, setEditMode] = useState();
  const [saved, setSaved] = useState();                                             //onClick save or not; setSaved(array.length)

  const addParticipant = () => setFriendModalVisible(true); 
  const closeEvent = () => setEnterEvent(false);                                     //back to Homepage
  const myTimeSlotsUpdate = (timeSlots) => {                                         //for setMyTimeSlots(): change to type Date
      let update_timeSlot = [];
      timeSlots.map((timeSlot) => {
        //get year, month, date in Int
        let year = parseInt(timeSlot.date.slice(0,4));
        let month = parseInt(timeSlot.date.slice(5,7)) - 1;
        let day = parseInt(timeSlot.date.slice(8,10));
        //get hour, minute in Int
        let hour = parseInt(timeSlot.startTime / 1);
        let minute = 0;
        if(timeSlot.startTime % 1 !== 0)
          minute = 30;

        let date = new Date(year, month, day, hour, minute);
        update_timeSlot.push(date);
      })
      setMyTimeSlots(update_timeSlot);
  }

  //for ScheduleSelector
  const handleChange = newTimeSlot => {
    setMyTimeSlots(newTimeSlot);
  }

  const turnEditMode = () => {
    server.send(JSON.stringify({
      type: "GetMyAvailableTimeSlots",
      args: { 
        requesterAccount: account,
        eventId: id,
      }
    }));
  }

  const turnViewMode = () => {
    if(myTimeSlots.length !== saved){
      displayStatus({
        type: "error",
        msg: "切換模式前請先儲存！",
      })
    }
    else{
      //GetAvailableTimeSlots()
      server.send(JSON.stringify({
        type: "GetAvailableTimeSlots",
        args: { 
          requesterAccount: account,
          eventId: id
        }
      }));
      setAvailableParticipants([]);
      setUnavailableParticipants([]);
    }

  }

  const updateTimeSlot = () => {
    console.log("myTimeSlots: ")
    console.log(myTimeSlots);
    //kick out duplicate element
    let arr = myTimeSlots;
    for (let i = 0; i < myTimeSlots.length; i++){
      for (let j = i+1; j < myTimeSlots.length; j++){
        if(myTimeSlots[i].getTime() === myTimeSlots[j].getTime())
          arr.splice(j,1);
      }
    }
    setMyTimeSlots(arr);
    console.log(myTimeSlots);

    //UpdateAvailableTimeSlots()
    let availableTime = []                                                //{date, startTime, endTime}
    myTimeSlots.map((timeSlot) => {
      let start = parseFloat(moment(timeSlot).format("HH.mm"));           //start time
      if(start % 1 !== 0)
        start = start + (0.5 - 0.3);
      let end = start + 0.5;                                              //end time
      availableTime.push({date: moment(timeSlot).format("YYYY-MM-DD"), startTime: start, endTime: end})
    })
    availableTime = mergeTimeSlots(availableTime);
    server.send(JSON.stringify({
      type: "UpdateAvailableTimeSlots",
      args: { 
        requesterAccount: account,
        eventId: id,
        availableTimeSlots: availableTime,
      }
    }));
    setSaved(myTimeSlots.length);
  }

  //for ScheduleSelector numDays
  var difference_in_time = new Date(endDate).getTime() - new Date(startDate).getTime();
  var difference_in_days = difference_in_time / (1000*3600*24);
  const days = difference_in_days + 1;

  //button css
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };
  
    return(
      <Layout className="App-homepage" style={{ minHeight: '100vh', backgroundColor:"#dbedff" }}>
      <Sider 
        style={{ overflow: 'auto', position: 'fixed', height: "100vh", left: 0, backgroundColor: "white",}}>
        <Menu mode="inline"  style={{fontSize: "18px"}}>
          <Menu.Item key="1" icon={<DoubleLeftOutlined />} onClick={closeEvent}>返回個人主頁</Menu.Item>

          <SubMenu key="sub1" icon={<UserOutlined />} title={`活動參加者(${participants.length})`}>
            {participants.map(({nickname, account}) => (                           
              <Menu.Item key={account}>{nickname}({account})</Menu.Item>
            ))}
          </SubMenu>

          <Menu.Item key="9" icon={<TeamOutlined />} onClick={addParticipant}>邀請更多人</Menu.Item>
        </Menu>
      </Sider>
      
      <InviteModal
        visible={friendModalVisible}
        onCreate={(value) => {
          //Invite()
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
      <Layout className="site-layout" style={{padding: 30, backgroundColor: "#dbedff"}}>
        <Content className=""style={{padding: 24, marginLeft: 200, Height:"100vh"}}>
          <Row style={{backgroundColor: "white", maxHeight: '90vh'}} >
            <Col 
              span={9} 
              style={{padding: 15}}
            >
              <h1 style={{fontWeight: "bold", fontSize:"25px"}}>{title}</h1>
              <ul style={{fontSize: 18}}>
                {(description.length === 0)?(null):(<li>活動內容：{description}</li>)}
                <li>活動發起人： {launcher.nickname}</li>
              </ul>
              <Row style={{margin: 5, minHeight: "55vh"}}>
                {(editMode === true)?(
                  <p></p>
                ):(
                  <>
                    <Col span={10} offset={1}>
                      <h1 style={{fontSize: 18}}>Available</h1>

                      <ul style={{fontSize: 18}}>
                      {availableParticipants.map(({nickname, account}) => (
                        (account !== undefined)? (
                          <li key={account}>{nickname}({account})</li>):(null)                         
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
                      <h1 style={{fontSize: 18}}>Unavailable</h1>
                      <ul style={{fontSize: 18}}>
                        {unavailableParticipants.map(({nickname, account}) => (
                          (account !== undefined)? (<li key={account}>{nickname}({account})</li>):(null)
                        ))}
                      </ul>
                    </Col>
                  </>
                )}
                
              </Row>
              <Row style={{marginTop: 20}}>
                {(editMode === true)?(
                  <Button type="primary" size="large" style={{ width: "15vh", marginLeft: "18vh", fontSize: "22px", borderRadius: 5}} onClick={turnViewMode}>切換瀏覽</Button>
                ):(
                  <Button type="primary" size="large" style={{width: "15vh", marginLeft: "18vh", fontSize: "22px", borderRadius: 5}} onClick={turnEditMode}>切換編輯</Button>
                )
                }
              </Row>
            </Col>

            <Col span={14} style={{ padding: 15, alignSelf:"center", marginRight: "0.5vh", maxHeight: "90vh", overflow:"scroll"}}>

              {(editMode === true)?(
                <>
                  <ScheduleSelector
                    onChange={handleChange}
                    selection={myTimeSlots}
                    numDays={days}
                    startDate={startDate}           //change to  startDate={new Date(Date.parse(startDate))}
                    minTime={startTime}
                    maxTime={endTime}
                    hourlyChunks={2}
                    timeFormat={"HH:mm"}
                    hoveredColor={"rgba(89, 120, 242, 1)"}
                    columnGap={'0.5vh'}
                    rowGap={'0.5vh'}
                  />
                  <Button  style={{width: "10vh", height: "4vh", marginTop: "2vh", marginLeft: "5vh", fontSize: "18px", borderRadius: 5}} onClick={updateTimeSlot}>儲存</Button>
                  <Button style={{width: "10vh", height: "4vh", marginTop: "2vh", marginLeft: "2vh", fontSize: "18px", borderRadius: 5}} onClick={() => setMyTimeSlots([])}>重填</Button>
                </>
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