import React from 'react';
import { Modal, Form, Input } from "antd";

const SignUpModal = ({visible, onCreate, onCancel}) => {
    const [form] = Form.useForm();
    return (
      <Modal
        visible={visible}
        title="註冊會員"
        okText="提交" cancelText="取消"
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
              message: "Error: 請設定暱稱！",
            },]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="account" label="帳號："
            rules={[{
              required: true,
              message: "Error: 請設定帳號！",
            },]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password" label="密碼："
            rules={[{
              required: true,
              message: "Error: 請設定密碼！",
            },]}
          >
            <Input.Password type="password"/>
          </Form.Item>
        </Form>
      </Modal>
    );
}

export default SignUpModal;