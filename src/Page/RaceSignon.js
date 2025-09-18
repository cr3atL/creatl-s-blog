import { useState } from 'react';
import { Typography, Form, Input, Button, Select, Card } from 'antd';
import ResponsiveLayout from '../components/ResponsiveLayout';

const { Title } = Typography;
const { Option } = Select;


const RaceSignon = () => {
  const [form] = Form.useForm();
  const [songSelectorVisible, setSongSelectorVisible] = useState(false);
  return (
    <ResponsiveLayout>
      <Card>
    <div>
      <Typography.Title level={2}>比赛报名</Typography.Title>
      <Form>
        <Form.Item label="游戏ID">
          <Input />
        </Form.Item>
        <Form.Item label="RATING">
          <Input />
        </Form.Item>
        <Form.Item>
        <Button type="primary">报名</Button>
      </Form.Item>
    </Form>
    </div>
    </Card>
    </ResponsiveLayout>
  );
}


export default RaceSignon
