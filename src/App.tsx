import "./App.css";
import MatchinToolHome from "./Screens/MatchinToolHome";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Screens/ErrorPage";
import FindTeamMembers from "./Screens/FindTeamMembers";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MatchinToolHome />,
    errorElement: <ErrorPage />,
  },
  { path: "/find-team-members", element: <FindTeamMembers /> },
]);

function App() {
  return (
    <div className="">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
