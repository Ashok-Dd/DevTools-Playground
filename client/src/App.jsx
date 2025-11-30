import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import DashboardHome from "./components/DashboardHome";
import HistoryPage from "./pages/History";
import JsonToCsv from "./tools/JsonToCsv";
import ApiTester from "./tools/ApiTester";
import JwtDecoder from "./tools/JwtDecoder";
import UrlEncoder from "./tools/UrlEncoder";
import RegexTester from "./tools/RegexTester";
import { useStore } from "./store";
import { Api } from "./Api";
import { useEffect } from "react";

function App() {
  const { userInfo, setUserInfo } = useStore();

  const getUserInfo = async () => {
    try {
      const response = await fetch(Api + "/auth/check-auth", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo({ ...data.user });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      getUserInfo();
    }
  }, [userInfo]);

  // ------------------ PUBLIC ROUTE CHECK ------------------
  const PublicRoute = () => {
    if (userInfo) return <Navigate to="/dashboard" replace />;
    return <Outlet />;
  };

  // ------------------ PRIVATE ROUTE CHECK ------------------
  const PrivateRoute = () => {
    if (!userInfo) return <Navigate to="/login" replace />;
    return <Outlet />;
  };

  return (
    <Router>
      <Routes>

        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ---------------- PRIVATE ROUTES (AUTH REQUIRED) ---------------- */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>

            {/* Default home */}
            <Route index element={<DashboardHome />} />

            {/* Dashboard pages */}
            <Route path="history" element={<HistoryPage />} />

            {/* Tools */}
            <Route path="tools/api-tester" element={<ApiTester />} />
            <Route path="tools/json-to-csv" element={<JsonToCsv />} />
            <Route path="tools/jwt-decoder" element={<JwtDecoder />} />
            <Route path="tools/url-encoder" element={<UrlEncoder />} />
            <Route path="tools/regex-tester" element={<RegexTester />} />

          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
