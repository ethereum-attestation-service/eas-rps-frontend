import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import { Root } from "./Root";
import Qr from "./Qr";
import Challenges from "./Challenges";
import Challenge from "./Challenge";
import Games from "./Games";
import Summary from "./Summary";
import Ongoing from "./Ongoing";
import Leaderboard from "./Leaderboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/:preComputedRecipient?",
        element: <Home />,
      },
      {
        path: "/qr",
        element: <Qr />,
      },
      {
        path: "/challenges",
        element: <Challenges />,
      },
      {
        path: "/challenge/:challengeId",
        element: <Challenge />,
      },
      {
        path: "/summary/:challengeId",
        element: <Summary />,
      },
      {
        path: "/games",
        element: <Games />,
      },
      {
        path: "/ongoing",
        element: <Ongoing />,
      },
      {
        path: "/leaderboard/:type",
        element: <Leaderboard />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
