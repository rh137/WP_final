import { useState } from "react";
import ScheduleSelector from 'react-schedule-selector'
import { Layout, Menu,  Row, Col, Button, Divider } from 'antd';
import {TeamOutlined, UserOutlined, DoubleLeftOutlined} from '@ant-design/icons';
import AddFriendModal from "../Components/AddFriendModal";
import TimeTable from "../Components/TimeTable";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const EventPage = ({friends ,setEnterEvent, account, title, description, startDate, endDate, startTime, endTime, participants, launcher, id, setParticipants, server, displayStatus}) => {
  server.onmessage = (m) => {
    onEvent(JSON.parse(m.data));
  };
  const onEvent = (e) => {
    const { type } = e;
    switch (type) {
      case 'Invite': {
        const {success} = e.result;
        if(success === true){
            setParticipants(e.data.newParticipant);
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
    }
};

  const [friendModalVisible, setFriendModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const addParticipant = () => setFriendModalVisible(true);
  const closeEvent = () => setEnterEvent(false);
  const turnEditMode = () => setEditMode(true);
  const turnViewMode = () => setEditMode(false);

  const [schedule, setSchedule] = useState([]);             
  const handleChange = newSchedule => {
    setSchedule(newSchedule);
    console.log(schedule);
  }

  //for ScheduleSelector numDays
  var difference_in_time = new Date(endDate).getTime() - new Date(startDate).getTime();
  var difference_in_days = difference_in_time / (1000*3600*24);
  const days = difference_in_days + 1;
  console.log(days);

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
            {friends.map(({nickname, account}) => (                           //change to participants(array not object)
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
            <h1 style={{fontWeight: "bold"}}>{title}</h1>
            <ul>
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
                    <div>
                    </div>
                  </Col>
                  <Col offset={6}>
                    <Divider 
                      type="vertical" 
                      style={{backgroundColor: "black",  width: 2, height: "52vh", overflow: "hidden"}} 
                    />
                  </Col>
                  <Col span={5} offset={0.5}>
                    <h1>Unavailable</h1>
                  </Col>
                </>
              )}
              
            </Row>
            <Row style={{marginTop: 20}}>
              {(editMode === true)?(
                <Button type="primary" size="large" style={{width: "20vh", marginLeft: "23vh"}} onClick={turnViewMode}>View</Button>
              ):(
                <Button size="large" style={{width: "20vh", marginLeft: "23vh"}} onClick={turnEditMode}>Edit</Button>
              )
              }
            </Row>
          </Col>

          <Col span={14} style={{ padding: 15}}>

             





            {/*(editMode === true)?(
              <ScheduleSelector
                onChange={handleChange}
                selection={schedule}
                numDays={days}
                startDate={startDate}
                minTime={startTime}
                maxTime={endTime}
                hourlyChunks={2}
                timeFormat={"HH:mm"}
                hoveredColor={"rgba(89, 154, 242, 1)"}
              />
            ):(
              <ScheduleSelector
                onChange={handleChange}
                selection={schedule}
                numDays={days}
                startDate={startDate}
                minTime={startTime}
                maxTime={endTime}
                hourlyChunks={2}
                timeFormat={"HH:mm"}
                hoveredColor={"rgba(89, 120, 242, 1)"}
            />)*/
            }
            
          </Col>
        </Row>        
      </Content>
          
    </Layout>
 
    )
    
  }

export default EventPage;