import "./App.css";
import MatchinToolHome from "./Screens/MatchinToolHome";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Screens/ErrorPage";
import FindTeamMembers from "./Screens/FindTeamMembers";
import TeamRequests from "./Screens/TeamRequests";
import JoinATeam from "./Screens/JoinATeam";
import MembersList from "./Screens/MembersList";
import MatchingToolInstructions from "./Screens/MatchingToolInstructions";
import SiteMap from "./Screens/SiteMap";
import DeleteEntries from "./Screens/DeleteEntries";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MatchinToolHome />,
      errorElement: <ErrorPage />,
    },
    { path: "/find-team-members", element: <FindTeamMembers /> },
    { path: "/students", element: <MembersList /> },
    { path: "/instruction", element: <MatchingToolInstructions /> },
    { path: "/sitemap", element: <SiteMap /> },
    { path: "/team-requests", element: <TeamRequests /> },
    { path: "/join-a-team", element: <JoinATeam /> },
    { path: "/delete-entries", element: <DeleteEntries /> },
  ],
  { basename: process.env.PUBLIC_URL }
);

function App() {
  return (
    <div className="">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
