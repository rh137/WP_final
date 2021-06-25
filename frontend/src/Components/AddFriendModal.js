import { Modal, Form, Select, Input } from "antd";
import { UsergroupAddOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddFriendModal = ({visible, onCreate, onCancel}) => {
    const [form] = Form.useForm();

    return (
      <Modal
        visible={visible}
        title="Invite Friends!"
        okText="Add" cancelText="Cancel"
        onOk={() => {
          form.validateFields().then((values) => {
            form.resetFields();
            onCreate(values);
          });
        }}
        onCancel={onCancel}
      >
      <Form form={form} layout="vertical" 
          name="form_in_modal">

          <Form.Item
            name="friend" label="加入朋友："
            rules={[{
              required: true,
              message: "Error: 請至少選擇一個人!",
            },]}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="輸入或下拉查看朋友"
              //defaultValue={['china']}
              optionLabelProp="label"
            >
              <Option value="friendA" >
                <div className="demo-option-label-item">
                  friendA
                </div>
              </Option>
              <Option value="friendB" >
                <div className="demo-option-label-item">
                  friendB
                </div>
              </Option>
              <Option value="friendC">
                <div className="demo-option-label-item">
                  friendC
                </div>
              </Option>
              <Option value="friendD">
                <div className="demo-option-label-item">
                  friendD
                </div>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Input 
              placeholder="enter friend's account" 
              prefix={<UsergroupAddOutlined/>} 
              style={{width: "100%"}} 
            />
          </Form.Item>

        </Form>
      </Modal>
    );
}

export default AddFriendModal;