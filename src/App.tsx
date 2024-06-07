import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MatchinToolHome from "./Screens/MatchinToolHome";
import Navbar from "./Components/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Screens/ErrorPage";
import Apply from "./Screens/Apply";
import FindTeamMembers from "./Screens/FindTeamMembers";
import JoinATeam from "./Screens/JoinATeam";
import EntryList from "./Screens/EntryList";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MatchinToolHome />,
    errorElement: <ErrorPage />,
  },
  { path: "/OIHEPOIJWtwtfvwkblwho", element: <EntryList /> },
  { path: "/apply", element: <Apply /> },
  { path: "/find-team-members", element: <FindTeamMembers /> },
  { path: "/join-a-team", element: <JoinATeam /> },
]);

function App() {
  return (
    <div className="">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
