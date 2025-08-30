import { Typography, Avatar, Card, Button } from "antd";
import { GithubOutlined, } from "@ant-design/icons";
import ResponsiveLayout from "../components/ResponsiveLayout";
import Item from "antd/es/list/Item";
import OSUIcon from "../icons/OSUIcon.png"; // 保持这样导入
import BiliBiliIcon from "../icons/bilibiliIcon.ico";
import CloudmusicIcon from "../icons/CloudmusicIcon.ico";
import { trackEvent } from "../utils/analytics";

const avatarImage = "https://github.com/cr3atL.png";

const { Title, Paragraph } = Typography;

const Home = () => {
  const handleIconClick = (url, platform) => {
    // 追踪社交媒体点击事件
    trackEvent('Social_Media', 'Click', platform);
    window.open(url, "_blank");
  };

  const navigateToChunithm = () => {
    // 追踪导航到CHUNITHM页面的事件
    trackEvent('Navigation', 'Click', 'Chunithm_Songs');
    window.location.href = '/creatl-s-blog/chunithm-songs';
  };

  const navigateToSdvx = () => {
    // 追踪导航到SDVX页面的事件
    trackEvent('Navigation', 'Click', 'SDVX_Songs');
    window.location.href = '/creatl-s-blog/sdvx-songs';
  };

  return (
    <ResponsiveLayout>
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
        <Card style={{ marginBottom: "24px" }}>
          <Title level={3}>关于我</Title>
          <Item style={{ fontSize: "16px" }}>
            我是桔子酱！/creatL。我正在学习react的前端开发,是一名初学者!
          </Item>
          <Item style={{ fontSize: "16px" }}>
            我喜欢玩osu!mania,无聊就爱玩定轨
          </Item>
          <Item style={{ fontSize: "16px" }}>
            我喜欢听trance,有好听的trance一定要联系我求你了求你了求你了。
          </Item>
          <Paragraph></Paragraph>
        </Card>

        <Card>
          <Title level={3}>这是我的一些主页</Title>
          <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
            <GithubOutlined
              style={{ fontSize: "24px", cursor: "pointer", color: "#000" }}
              onClick={() => handleIconClick("https://github.com/cr3atL", "GitHub")}
              title="GitHub"
            />
            <img
              src={BiliBiliIcon}
              alt="bilibili"
              style={{
                width: "24px",
                height: "24px",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() =>
                handleIconClick(
                  "https://space.bilibili.com/401366615?spm_id_from=333.1007.0.0/",
                  "Bilibili"
                )
              }
              title="bilibili主页"
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
            <img
              src={OSUIcon}
              alt="OSU!"
              style={{
                width: "24px",
                height: "24px",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() =>
                handleIconClick("https://osu.ppy.sh/users/24792120", "OSU")
              }
              title="OSU!主页"
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
            <img
              src={CloudmusicIcon}
              alt="网易云歌单"
              style={{
                width: "24px",
                height: "24px",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() =>
                handleIconClick(
                  "https://music.163.com/playlist?id=12625543271&uct2=U2FsdGVkX1+cyjQGLYDuxxrxXWCr+2t5vb0lSKRkye4=",
                  "Netease_Music"
                )
              }
              title="网易云歌单"
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
        </Card>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <Title level={3}>最新动态</Title>
          <Paragraph style={{ fontSize: "16px" }}>
            博客正在开发中，敬请期待更多精彩内容...
          </Paragraph>
          <Paragraph style={{fontSize:"16px"}}>当然如果你有什么好玩的想法或者发现了什么bug需要我去修复的也可以直接联系我</Paragraph>
          <Paragraph style={{fontSize:"16px"}}>我的联系方式在about页面中有！</Paragraph>
          <Paragraph style={{fontSize:"16px"}}>当然你直接bilibili私信我也可以</Paragraph>
          
          <Card style={{ marginTop: "20px" }}>
            <Title level={4}>🎵 新功能：CHUNITHM 曲库查询</Title>
            <Paragraph style={{ fontSize: "16px" }}>
              我添加了 CHUNITHM 曲库查询功能！你可以查看所有 CHUNITHM 歌曲的详细信息，包括难度、版本、类型等。
            </Paragraph>
            <Button 
              type="primary" 
              onClick={navigateToChunithm}
              style={{ marginTop: "10px" }}
            >
              查看 CHUNITHM 曲库
            </Button>
          </Card>
          
          <Card style={{ marginTop: "20px" }}>
            <Title level={4}>🎵 新功能：SDVX 曲库查询</Title>
            <Paragraph style={{ fontSize: "16px" }}>
              我添加了 SOUND VOLTEX 曲库查询功能！你可以查看所有 SDVX 歌曲的详细信息，包括难度、版本、类型等。
            </Paragraph>
            <Button 
              type="primary" 
              onClick={navigateToSdvx}
              style={{ marginTop: "10px" }}
            >
              查看 SDVX 曲库
            </Button>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Home;
