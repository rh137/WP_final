import { useState } from "react";
import ScheduleSelector from 'react-schedule-selector'
import { Layout, Menu,  Row, Col, Button, Divider } from 'antd';
import {
    TeamOutlined,
    UserOutlined,
    DoubleLeftOutlined
} from '@ant-design/icons';

import AddFriendModal from "../Components/AddFriendModal";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const EventPage = ({setEventCreated, startDate, endDate, startTime, endTime}) => {
  console.log(startTime, endTime )
    const [friendModalVisible, setFriendModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const addFriend = () => setFriendModalVisible(true);
    const closeEvent = () => setEventCreated(false);
    const turnEditMode = () => setEditMode(true);
    const turnViewMode = () => setEditMode(false);

    const [schedule, setSchedule] = useState([]);             //useState([Date])
    const handleChange = newSchedule => {
      setSchedule(newSchedule);
      console.log(schedule);
    }

    var difference_in_time = endDate.getTime() -startDate.getTime();
    var difference_in_days = difference_in_time / (1000*3600*24)
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
      }}
      >
        <Menu  
          //defaultSelectedKeys={['sub1']} 
          mode="inline"
          style={{fontSize: "18px"}}
        >
          <Menu.Item key="1" icon={<DoubleLeftOutlined />} onClick={closeEvent}>
            Back
          </Menu.Item>

          <SubMenu key="sub1" icon={<UserOutlined />} title="Participant">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>

          <Menu.Item key="9" icon={<TeamOutlined />} onClick={addFriend}>
            Invite More
          </Menu.Item>
        </Menu>
      </Sider>
      
      <AddFriendModal
        visible={friendModalVisible}
        onCreate={() => {
            setFriendModalVisible(false);
        }}
        onCancel={() => {
            setFriendModalVisible(false);
        }}
      />

      <Content className=""style={{padding: 24, marginLeft: 200, height:"100vh"}}>
        <Row style={{backgroundColor: "white"}} >
          <Col 
            span={10} 
            style={{padding: 15}}
          >
            <h1 style={{fontWeight: "bold"}}>title</h1>
            <div style={{minHeight: "20vh"}}>description</div>
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
          
          <ScheduleSelector
            selection={schedule}
            numDays={days}
            startDate={startDate}
            minTime={startTime}
            maxTime={endTime}
            hourlyChunks={2}
            timeFormat={"HH:mm"}
            onChange={handleChange}
          />
          
          
          
          </Col>
        </Row>        
      </Content>
          
    </Layout>
 
      
    )}

export default EventPage;