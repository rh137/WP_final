import { useState } from "react";
import ScheduleSelector from 'react-schedule-selector'
import moment from "moment";
import { Layout, Menu,  Row, Col, Button, Divider } from 'antd';
import {TeamOutlined, UserOutlined, DoubleLeftOutlined} from '@ant-design/icons';
import AddFriendModal from "../Components/AddFriendModal";
import ScheduleTable from "../Components/ScheduleTable";

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

      case 'GetAvailableTimeSlots': {
        const {success} = e.result;
        displayStatus({
          type: "error",
          msg: e.result.type,
        })
        setTimeSlots(e.result.timeSlots);

      }

      case 'UpdateAvailableTimeSlots': {
        const {success} = e.result;
        if(success === true){
          displayStatus({
              type: "success",
              msg: "Saved",
          }); 
          setEditMode(false);      
        }
        else{
            displayStatus({
                type: "error",
                msg: e.result.errorType,
            })
        }
        break;
      }
      //undone
      case 'GetMyAvailableTimeSlots': {
        const {success} = e.result;
        if(success === true){ 
          let year = parseInt(e.result.date.splice(0,4))
          let month = parseInt(e.result.date.splice(5,7)) -1
          let day = parseInt(e.result.date.splice(8))



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
    let availableTime = []                                                //{date, startTime, endTime}
    schedule.map((timeSlot) => {
      let start = parseFloat(moment(timeSlot).format("HH.mm"));           //start time
      if(start % 1 !== 0)
        start = start + (0.5 - 0.3);
      let end = start + 0.5;                                              //end time
      availableTime.push({date: moment(timeSlot).format("YYYY-MM-DD"), startTime: start, endTime: end})
    })
    console.log(availableTime);

    /*
    server.send(JSON.stringify({
      type: "UpdateAvailableTimeSlots",
      args: { 
        requesterAccount: account,
        eventId: id,
        availableTimeSlots: availableTime,
      }
    }));

    server.send(JSON.stringify({
      type: "GetAvailableTimeSlots",
      args: { 
        requesterAccount: account,
        eventId: id
      }
    }));

    */
    setEditMode(false);
  }

  const [schedule, setSchedule] = useState([]);             
  const handleChange = newSchedule => {
    setSchedule(newSchedule);
    console.log(schedule);
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
            Back
          </Menu.Item>

          <SubMenu key="sub1" icon={<UserOutlined />} title="Participants">
            {participants.map(({nickname, account}) => (                           //change to participants(array not object)
              <Menu.Item key={account}>{nickname}</Menu.Item>
            ))}
          </SubMenu>

          <Menu.Item key="9" icon={<TeamOutlined />} onClick={addParticipant}>
            Invite More
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

      <Content className=""style={{padding: 24, marginLeft: 200, Height:"100vh", overflow:"scroll"}}>
        <Row style={{backgroundColor: "white"}} >
          <Col 
            span={10} 
            style={{padding: 15}}
          >
            <h1 style={{fontWeight: "bold", fontSize:"22px"}}>{title}</h1>
            <ul style={{fontSize: "20px"}}>
              {(description.length === 0)?(null):(<li>Description: {description}</li>)}
              <li>Launcher: {launcher.nickname}</li>
            </ul>
            <Row style={{margin: 5, minHeight: "55vh"}}>
              {(editMode === true)?(
                <p></p>
              ):(
                <>
                  <Col span={5} offset={0}>
                    <h1>Available</h1>
                    <ul>
                      {availableParticipants.map(({account, nickname}) => {
                        <li key={account}>{nickname}</li>
                      })}
                    </ul>
                  </Col>
                  <Col offset={6}>
                    <Divider 
                      type="vertical" 
                      style={{backgroundColor: "black",  width: 2, height: "52vh", overflow: "hidden"}} 
                    />
                  </Col>
                  <Col span={5} offset={0.5}>
                    <h1>Unavailable</h1>
                    <ul>
                      {unavailableParticipants.map(({account, nickname}) => {
                        <li key={account}>{nickname}</li>
                      })}
                    </ul>
                  </Col>
                </>
              )}
              
            </Row>
            <Row style={{marginTop: 20}}>
              {(editMode === true)?(
                <Button type="primary" size="large" style={{width: "20vh", marginLeft: "23vh", fontSize: "22px"}} onClick={turnViewMode}>View</Button>
              ):(
                <Button type="primary" size="large" style={{width: "20vh", marginLeft: "23vh", backgroundColor: "#7845D9", fontSize: "22px", borderColor: "#7845D9"}} onClick={turnEditMode}>Edit</Button>
              )
              }
            </Row>
          </Col>

          <Col span={14} style={{ padding: 15}}>

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
                setAvailableParticipants={setAvailableParticipants}
                setUnavailableParticipants={setUnavailableParticipants}
              />
              /*
              <ScheduleSelector
                onChange={(newSchedule)=>console.log(newSchedule)}
                selection={result}
                numDays={days}
                startDate={startDate}
                minTime={startTime}
                maxTime={endTime}
                hourlyChunks={2}
                timeFormat={"HH:mm"}
                hoveredColor={"#B19CD9"}
                unselectedColor={"#e8deff"}
            />*/
            )
            }
            
          </Col>
        </Row>        
      </Content>
          
    </Layout>
 
    )
    
  }

export default EventPage;