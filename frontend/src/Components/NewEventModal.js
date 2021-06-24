import { Modal, Form, Input, DatePicker, TimePicker, Select } from "antd";
import moment from "moment";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const NewEventModal = ({visible, onCreate, onCancel}) => {
    const [form] = Form.useForm();
    const tailLayout = {
      wrapperCol: { offset: 0, span: 13 },
    };

    return (
      <Modal
        visible={visible}
        title="加好友!"
        okText="Add" cancelText="Cancel"
        onOk={() => {
          form.validateFields().then((data) => {
            form.resetFields();
            onCreate(data);
          });
        }}
        onCancel={onCancel}
      >
      <Form form={form} layout="vertical" 
          name="form_in_modal">
          <Form.Item
            name="title" label=" 活動標題："
            rules={[{
              required: true,
              message: "Error: 請輸入活動標題!",
            },]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description" label="活動內容簡述："
            rules={[{
              required: true,
              message: "Error: 請輸入活動內容!",
            },]}
          >
            <TextArea rows={5} />
          </Form.Item>

          <Form.Item
            name="date_range" label="選擇日期區間："
            rules={[{
              required: true,
              message: "Error: 請選定投票的日期區間!",
            },]}
            {...tailLayout}
          >
            <RangePicker />
          </Form.Item>

          <Form.Item
            name="time_range" label="選擇時間區間："
            rules={[{
              required: true,
              message: "Error: 請選定投票的時間區間!",
            },]}
            {...tailLayout}
          >
            <TimePicker.RangePicker 
              //defaultValue={[moment('--:--', 'HH:mm'), moment('--:--', 'HH:mm')]} 
              format={"HH:mm"} 
              minuteStep={30} 
              order="true"
            />
          </Form.Item>

          <Form.Item
            name="participant" label="選擇參加者："
            rules={[{
              required: true,
              message: "Error: 請至少選定一名參加者!",
            },]}
          >

            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="請加入欲邀請的朋友們"
              //defaultValue={['china']}
              optionLabelProp="label"
            >
              <Option value="friend1" >
                <div className="demo-option-label-item">
                  friend1
                </div>
              </Option>
              <Option value="friend2" >
                <div className="demo-option-label-item">
                  friend2
                </div>
              </Option>
              <Option value="friend3">
                <div className="demo-option-label-item">
                  friend3
                </div>
              </Option>
              <Option value="friend4">
                <div className="demo-option-label-item">
                  friend4
                </div>
              </Option>
            </Select>
          </Form.Item>

        </Form>
      </Modal>
    );
}

export default NewEventModal;