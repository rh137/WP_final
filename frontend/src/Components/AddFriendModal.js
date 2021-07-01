import { Modal, Form, Input } from "antd";
import { UsergroupAddOutlined } from '@ant-design/icons';

const AddFriendModal = ({visible, onCreate, onCancel}) => {
    const [form] = Form.useForm();

    return (
      <Modal
        visible={visible}
        title="邀請/加入朋友!"
        okText="加入" cancelText="取消"
        onOk={() => {
          form.validateFields().then((values) => {
            form.resetFields();
            onCreate(values);
          });
        }}
        onCancel={onCancel}
      >
      <Form form={form} layout="vertical" 
          name="form_in_modal" >

          <Form.Item
            name="friendAccount" label="加入朋友："
            rules={[{
              required: true,
              message: "Error: 請輸入朋友的帳號!",
            },]}
          >
            <Input 
              placeholder="請輸入朋友的帳號" 
              prefix={<UsergroupAddOutlined/>} 
              style={{width: "100%"}} 
            />
          </Form.Item>
        </Form>
      </Modal>
    );
}

export default AddFriendModal;