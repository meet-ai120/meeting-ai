import { createRoute } from "@tanstack/react-router";
import HomePage from "../pages/HomePage";
import { RootRoute } from "./__root";
import SignUp from "@/pages/SignUp";
import MeetingPage from "@/pages/MeetingPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";

// TODO: Steps to add a new route:
// 1. Create a new page component in the '../pages/' directory (e.g., NewPage.tsx)
// 2. Import the new page component at the top of this file
// 3. Define a new route for the page using createRoute()
// 4. Add the new route to the routeTree in RootRoute.addChildren([...])
// 5. Add a new Link in the navigation section of RootRoute if needed

// Example of adding a new route:
// 1. Create '../pages/NewPage.tsx'
// 2. Import: import NewPage from '../pages/NewPage';
// 3. Define route:
//    const NewRoute = createRoute({
//      getParentRoute: () => RootRoute,
//      path: '/new',
//      component: NewPage,
//    });
// 4. Add to routeTree: RootRoute.addChildren([HomeRoute, NewRoute, ...])
// 5. Add Link: <Link to="/new">New Page</Link>

export const HomeRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: HomePage,
});

export const SignUpRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/signup",
  component: SignUp,
});

export const MeetingRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/meeting/$meetingId",
  component: MeetingPage,
});

export const ProfileRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/profile",
  component: ProfilePage,
});

export const SettingsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/settings",
  component: SettingsPage,
});

export const rootTree = RootRoute.addChildren([
  HomeRoute,
  SignUpRoute,
  MeetingRoute,
  ProfileRoute,
  SettingsRoute,
]);
