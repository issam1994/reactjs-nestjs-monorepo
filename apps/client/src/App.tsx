import { RouterProvider } from "react-router";
import { router } from "./router";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function App() {
  const { getProfile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getProfile(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <Spin fullscreen indicator={<LoadingOutlined spin />} size="large" />
    );
  }
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
