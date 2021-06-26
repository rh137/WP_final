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
              message: "Error: 請輸入朋友帳號!",
            },]}
          >
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