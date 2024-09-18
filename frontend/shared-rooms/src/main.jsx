import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


import "./index.css";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import RoomDetailPage from "./pages/RoomDetailPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path:"/LoginPage",
    element: <LoginPage></LoginPage>
  },
  {
    path:"/RegisterPage",
    element: <RegisterPage></RegisterPage>
  },
  {
    path:"/AboutPage",
    element:<AboutPage></AboutPage>
  },
  {
    path:"/RoomDetailPage",
    element:<RoomDetailPage></RoomDetailPage>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <RouterProvider router={router}></RouterProvider>

</React.StrictMode>,
);