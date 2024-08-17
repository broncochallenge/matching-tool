import "./App.css";
import MatchinToolHome from "./Screens/MatchinToolHome";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Screens/ErrorPage";
import FindTeamMembers from "./Screens/FindTeamMembers";
import TeamRequests from "./Screens/TeamRequests";
import JoinATeam from "./Screens/JoinATeam";
import MembersList from "./Screens/MembersList";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MatchinToolHome />,
      errorElement: <ErrorPage />,
    },
    { path: "/find-team-members", element: <FindTeamMembers /> },
    { path: "/students", element: <MembersList /> },
    { path: "/team-requests", element: <TeamRequests /> },
    { path: "/join-a-team", element: <JoinATeam /> },
  ],
  { basename: "/matching-tool" }
);

function App() {
  return (
    <div className="">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
