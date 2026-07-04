import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import PeopleLayout from "@/pages/people/PeopleLayout";
import PeopleLogin from "@/pages/people/Login";
import PeopleDashboard from "@/pages/people/Dashboard";
import Attendance from "@/pages/people/Attendance";
import AllAttendance from "@/pages/people/AllAttendance";
import Leaves from "@/pages/people/Leaves";
import LeaveApprovals from "@/pages/people/LeaveApprovals";
import Directory from "@/pages/people/Directory";
import Employees from "@/pages/people/Employees";
import PeopleSettings from "@/pages/people/Settings";
import Profile from "@/pages/people/Profile";
import Announcements from "@/pages/people/Announcements";
import Documents from "@/pages/people/Documents";
import Onboarding from "@/pages/people/Onboarding";
import Projects from "@/pages/people/Projects";
import Timesheets from "@/pages/people/Timesheets";
import TimesheetApprovals from "@/pages/people/TimesheetApprovals";
import Goals from "@/pages/people/Goals";
import Reviews from "@/pages/people/Reviews";
import Payroll from "@/pages/people/Payroll";
import Payslips from "@/pages/people/Payslips";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/people/login" element={<PeopleLogin />} />
          <Route path="/people" element={<PeopleLayout />}>
            <Route index element={<PeopleDashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="attendance/all" element={<AllAttendance />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="leaves/approvals" element={<LeaveApprovals />} />
            <Route path="directory" element={<Directory />} />
            <Route path="employees" element={<Employees />} />
            <Route path="documents" element={<Documents />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="projects" element={<Projects />} />
            <Route path="timesheets" element={<Timesheets />} />
            <Route path="timesheets/approvals" element={<TimesheetApprovals />} />
            <Route path="goals" element={<Goals />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="payslips" element={<Payslips />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="settings" element={<PeopleSettings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<AnimatedRoutes />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
