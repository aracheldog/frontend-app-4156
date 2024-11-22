import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Layout, Menu } from "antd";
import Services from "./components/Services";
import Categories from "./components/Categories";

const { Header, Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout>
        <Header>
          <NavigationMenu />
        </Header>
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/services" element={<Services />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

// 导航菜单组件
const NavigationMenu = () => {
  const location = useLocation();
  const currentKey = location.pathname;

  return (
    <Menu theme="dark" mode="horizontal" selectedKeys={[currentKey]}>
      <Menu.Item key="/services">
        <Link to="/services">Services</Link>
      </Menu.Item>
      <Menu.Item key="/categories">
        <Link to="/categories">Categories</Link>
      </Menu.Item>
    </Menu>
  );
};

export default App;
