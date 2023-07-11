import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  LoginOutlined,
  UserAddOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const { Item, SubMenu, ItemGroup } = Menu; // instead of menu.item ...now directly use item
const TopNav = () => {
  const [current, setCurrent] = useState("");
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
    console.log(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/login");
  };

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[current]}
      theme="dark"
      style={{ display: "block" }}
      className="mb-2"
    >
      <Item key="/" onClick={(e) => setCurrent(e.key)} icon={<HomeOutlined />}>
        <Link href="/" legacyBehavior>
          <a>Home</a>
        </Link>
      </Item>

      {user && user.role && user.role.includes("Instructor") ? (
        <Item
          key="/instructor/course/create"
          onClick={(e) => setCurrent(e.key)}
          icon={<CarryOutOutlined />}
        >
          <Link href="/instructor/course/create" legacyBehavior>
            <a>Create Course</a>
          </Link>
        </Item>
      ) : (
        <Item
          key="/user/become-instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
        >
          <Link href="/user/become-instructor" legacyBehavior>
            <a>Become Instructor</a>
          </Link>
        </Item>
      )}

      {user && user.role && user.role.includes("Instructor") && (
        <Item
          key="/instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
          style={{ float: "right" }}
        >
          <Link href="/instructor" legacyBehavior>
            <a>Instructor</a>
          </Link>
        </Item>
      )}

      {user == null && (
        <>
          <Item
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
          >
            <Link href="/login" legacyBehavior>
              <a>Login</a>
            </Link>
          </Item>

          <Item
            key="/register"
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
          >
            <Link href="/register" legacyBehavior>
              <a>Register</a>
            </Link>
          </Item>
        </>
      )}

      {user !== null && (
        <SubMenu
          icon={<UserOutlined />}
          title={user && user.name}
          style={{ float: "right" }}
        >
          <ItemGroup>
            <Item key="/user">
              <Link href="/user" legacyBehavior>
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item onClick={logout}>Logout</Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
