import { Modal, Form, Input } from "antd";

const SignUpModal = ({visible, onCreate, onCancel}) => {
    const [form] = Form.useForm();
    return (
      <Modal
        visible={visible}
        title="Sign Up!"
        okText="Submit" cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form.validateFields().then((values) => {
            form.resetFields();
            onCreate(values);
          });
      }}>
      <Form form={form} layout="vertical" 
          name="form_in_modal">
          <Form.Item
            name="nickname" label=" 暱稱："
            rules={[{
              required: true,
              message: "Error: Please enter Nickname!",
            },]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="account" label="帳號："
            rules={[{
              required: true,
              message: "Error: Please enter Account!",
            },]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password" label="密碼："
            rules={[{
              required: true,
              message: "Error: Please enter Password!",
            },]}
          >
            <Input.Password type="password"/>
          </Form.Item>
        </Form>
      </Modal>
    );
}

export default SignUpModal;