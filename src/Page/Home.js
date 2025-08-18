import React from "react";
import { Typography, Avatar, Card } from "antd";
import Layout from "../components/Layout";
import Item from "antd/es/list/Item";
const avatarImage = "https://github.com/cr3atL.png";

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <Avatar
            src={avatarImage}
            size={64}
            style={{
              marginRight: "16px",
              boxShadow:
                "0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
            }}
          />
          <Title level={2}>欢迎来到我的博客</Title>
        </div>

        <Paragraph>这是我乱写的博客</Paragraph>
             <Card style={{marginBottom:'24px'}}>
              <Title level={3}>关于我</Title>
              <Item style={{fontSize:'16px'}}>我是桔子酱！/creatL。我正在学习react的前端开发,是一名初学者!</Item>
              <Item style={{fontSize:'16px'}}>我喜欢玩osu!mania,无聊就爱玩定轨</Item>
              <Item style={{fontSize:'16px'}}>我喜欢听trance,有好听的trance一定要联系我求你了求你了求你了。</Item>
              <Paragraph></Paragraph>
            </Card>

            <Card>
              <Title level={3}>这是我的一些主页</Title>
              <></>
            </Card>
        <div style={{ marginTop: "32px", 
                      fontSize:'24px',
                    }}>
          <Title level={3}>最新动态</Title>
          <Paragraph style={{fontSize: '16px'}}>博客正在开发中，敬请期待更多精彩内容...</Paragraph>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
