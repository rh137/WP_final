import { Modal, Form, Input, DatePicker, TimePicker, Select } from "antd";
import moment from "moment";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const NewEventModal = ({friends, visible, onCreate, onCancel}) => {
    const [form] = Form.useForm();
    const tailLayout = {
      wrapperCol: { offset: 0, span: 13 },
    };

    return (
      <Modal
        visible={visible}
        title="建立活動!"
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
              format={"HH:mm"} 
              minuteStep={30} 
              order="false"
            />
          </Form.Item>
          
          <Form.Item
            name="participants" label="選擇參加者："
            rules={[{
              required: true,
              message: "Error: 請至少選定一名參加者!",
            },]}
          >

            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="請加入欲邀請的朋友們"
              optionLabelProp="label"
            >
              {friends.map(({account, nickname}) => (
                <Option value={account} key={account}>
                    <div>
                      {nickname} ({account})
                    </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
        </Form>
      </Modal>
    );
}

export default NewEventModal;