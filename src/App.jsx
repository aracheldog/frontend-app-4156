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
import ServiceDetail from "./components/Services/ServiceDetail";

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
              {/* Public Routes */}
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/services"
                element={
                  <PrivateRoute>
                    <Services />
                  </PrivateRoute>
                }
              />
              <Route path="/services/:id" element={<ServiceDetail />} />
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

// Navigation Menu Component
const NavigationMenu = () => {
  const location = useLocation();
  const currentKey = location.pathname;
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[currentKey]}
        style={{ flex: 1 }}
      >
        <Menu.Item key="/services">
          <Link to="/services">Services</Link>
        </Menu.Item>
        <Menu.Item key="/categories">
          <Link to="/categories">Categories</Link>
        </Menu.Item>
      </Menu>
      <div>
        {!isAuthenticated ? (
          <>
            <Button type="link" style={{ marginRight: 16 }}>
              <Link to="/login">Login</Link>
            </Button>
            <Button type="link">
              <Link to="/register">Register</Link>
            </Button>
          </>
        ) : (
          <>
            <span style={{ marginRight: 16, color: "white" }}>
              Welcome, {user?.username || "User"}
            </span>
            <Button type="link" onClick={logout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
