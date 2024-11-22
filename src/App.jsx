import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import Services from "./components/Services";
import Categories from "./components/Categories";
import LogIn from "./components/UserLogin/LogIn";
import Register from "./components/UserLogin/Signup";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRouter";

const { Header, Content } = Layout;

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Header>
            <NavigationMenu />
          </Header>
          <Content style={{ padding: "20px" }}>
            <Routes>
              {/* 公共路由 */}
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<Register />} />

              {/* 受保护路由 */}
              <Route
                path="/services"
                element={
                  <PrivateRoute>
                    <Services />
                  </PrivateRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <PrivateRoute>
                    <Categories />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

// 导航菜单组件
const NavigationMenu = () => {
  const location = useLocation();
  const currentKey = location.pathname;
  const { isAuthenticated, logout } = useAuth();

  return (
    <Menu theme="dark" mode="horizontal" selectedKeys={[currentKey]}>
      <Menu.Item key="/services">
        <Link to="/services">Services</Link>
      </Menu.Item>
      <Menu.Item key="/categories">
        <Link to="/categories">Categories</Link>
      </Menu.Item>
      {!isAuthenticated ? (
        <>
          <Menu.Item key="/login">
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="/register">
            <Link to="/register">Register</Link>
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="/logout">
          <Button type="link" onClick={logout}>
            Logout
          </Button>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default App;
