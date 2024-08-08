import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeWrapper from "./Wrappers/HomeWrapper";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Home from "./Components/Home";
import LoginRoute from "./Routes/LoginRoute";
import userLoaders from "./loaders/userLoaders"
import ProtectedRoute from "./Routes/ProtectedRoute";
import MusicPlayer from "./Components/MusicPlayer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginRoute />,
    loader: userLoaders.checkAuth,
    children: [
      {
        path: "",
        element: <HomeWrapper />,
        children: [
          {
            path: "/",
            element: <Home />
          },
          {
            path: "register",
            element: <Register />
          },
          {
            path: "login",
            element: <Login />
          }
        ]
      }
    ]
  },
  {
    path: "dashboard",
      element: <MusicPlayer />,
    loader: userLoaders.checkAuth,
  //   children: [
  //     {
  //       path: "/music",
  //       element: <MusicPlayer />,
  //       loader: userLoaders.getUser,
  //     }
  //   ]
  },
  // {
  //   path: "admin",
  //   element: <ProtectedRoute />,
  //   loader: userLoaders.checkAuth,
  //   children: [
  //     {
  //       path: "",
  //       element: <AdminRoute />,
  //       loader: userLoaders.getUser,
  //       children: [
  //         {
  //           path: "",
  //           element: <AdminDashboardWrapper />,
  //           loader: userLoaders.getUser,
  //           children: [
  //             {
  //               path: "products",
  //               element: <CreateProduct />
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App;