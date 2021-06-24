import { Modal, Form, Select } from "antd";

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
            name="invitation" label="加入朋友："
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
                  friend1
                </div>
              </Option>
              <Option value="friendB" >
                <div className="demo-option-label-item">
                  friend2
                </div>
              </Option>
              <Option value="friendC">
                <div className="demo-option-label-item">
                  friend3
                </div>
              </Option>
              <Option value="friendD">
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

export default AddFriendModal;