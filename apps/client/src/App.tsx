import { RouterProvider } from "react-router";
import { router } from "./router";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
