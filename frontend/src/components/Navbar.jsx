import { Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import api from "../api";

function Navbar() {
  const { data: username } = useQuery({
    queryKey: ["username"],
    queryFn: () => api.get("/api/user/me").then((res) => res.data.username),
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        backgroundColor: "white",
        color: "gray",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <span style={{ fontSize: "20px", fontWeight: "bold" }}>
        Welcome, {username}
      </span>
      <Button
        danger
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </Button>
    </div>
  );
}


export default Navbar;