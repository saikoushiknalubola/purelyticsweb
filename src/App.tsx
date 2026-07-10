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
import Learning from "@/pages/people/Learning";
import LearningDetail from "@/pages/people/LearningDetail";
import LearningAdmin from "@/pages/people/LearningAdmin";
import Assets from "@/pages/people/Assets";
import AssetsAdmin from "@/pages/people/AssetsAdmin";
import Helpdesk from "@/pages/people/Helpdesk";
import HelpdeskTicket from "@/pages/people/HelpdeskTicket";
import Expenses from "@/pages/people/Expenses";
import ExpenseApprovals from "@/pages/people/ExpenseApprovals";
import Travel from "@/pages/people/Travel";
import TravelApprovals from "@/pages/people/TravelApprovals";
import Kudos from "@/pages/people/Kudos";

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
            <Route path="learning" element={<Learning />} />
            <Route path="learning/admin" element={<LearningAdmin />} />
            <Route path="learning/:id" element={<LearningDetail />} />
            <Route path="assets" element={<Assets />} />
            <Route path="assets/admin" element={<AssetsAdmin />} />
            <Route path="helpdesk" element={<Helpdesk />} />
            <Route path="helpdesk/:id" element={<HelpdeskTicket />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="expenses/approvals" element={<ExpenseApprovals />} />
            <Route path="travel" element={<Travel />} />
            <Route path="travel/approvals" element={<TravelApprovals />} />
            <Route path="kudos" element={<Kudos />} />
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
