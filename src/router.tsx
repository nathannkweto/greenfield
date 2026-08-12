import { createBrowserRouter } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import PortalLayout from "./layouts/PortalLayout";

// Error Pages
import GlobalErrorPage from "./components/errors/GlobalErrorPage";
import PortalErrorPage from "./components/errors/PortalErrorPage";

import { adminNavItems, lecturerNavItems, studentNavItems } from './config/navItems';

// Pages
import LandingPage from "./pages/public/LandingPage.tsx";
import ProgramsPage from "./pages/public/ProgramsPage.tsx";
import ContactPage from "./pages/public/ContactPage.tsx";
import ProgramDetailsPage from "./pages/public/ProgramDetailsPage.tsx";
import ApplyPage from "./pages/public/ApplyPage.tsx";
import LoginPage from "./pages/public/LoginPage.tsx";
import StudentDashboard from "./pages/student/StudentDashboard.tsx";
import StudentAcademics from "./pages/student/StudentAcademics.tsx";
import CourseDetails from "./pages/student/CourseDetailsPage.tsx";
import Exams from "./pages/student/StudentExams.tsx";
import StudentSettings from "./pages/student/StudentSettings.tsx";
import StudentFees from "./pages/student/StudentFees.tsx";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard.tsx";
import ManageCourse from "./pages/lecturer/ManageCourse.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import CollegeManagement from "./pages/admin/CollegeManagement.tsx";
import StudentsPage from "./pages/admin/StudentsPage.tsx";
import StudentDetailsPage from "./pages/admin/StudentDetailsPage.tsx";
import AnnouncementsPage from "./pages/admin/AnnouncementsPage.tsx";
import CreateAnnouncementPage from "./pages/admin/CreateAnnouncementPage.tsx";
import FinancialCenterPage from "./pages/admin/FinancialCenterPage.tsx";
import TermsOfServicePage from "./pages/public/TermsOfServicePage.tsx";

// A reusable loader that forces a native React Router 404 ErrorResponse
const throwNotFound = () => {
    throw new Response("Not Found", { status: 404 });
};

export const router = createBrowserRouter([
    {
        // ABSOLUTE ROOT
        errorElement: <GlobalErrorPage />,
        children: [
            {
                // PUBLIC ROUTES
                path: "/",
                element: <PublicLayout />,
                children: [
                    {
                        errorElement: <GlobalErrorPage />,
                        children: [
                            { index: true, element: <LandingPage /> },
                            {
                                path: "programs",
                                children: [
                                    { index: true, element: <ProgramsPage /> },
                                    { path: ":programId", element: <ProgramDetailsPage /> }
                                ]
                            },
                            { path: "contact", element: <ContactPage /> },
                            { path: "apply", element: <ApplyPage /> },
                            { path: "login", element: <LoginPage /> },
                            { path: "terms", element: <TermsOfServicePage />},
                            // Trigger true 404 for bad public routes
                            { path: "*", loader: throwNotFound }
                        ]
                    }
                ],
            },
            {
                // ADMIN PORTAL
                path: "/admin",
                element: <PortalLayout navItems={adminNavItems} />,
                children: [
                    {
                        errorElement: <PortalErrorPage />,
                        children: [
                            { path: "dashboard", element: <AdminDashboard /> },
                            {
                                path: "students",
                                children: [
                                    { index: true, element: <StudentsPage /> },
                                    { path: ":id", element: <StudentDetailsPage /> }
                                ]
                            },
                            {
                                path: "announcements",
                                children: [
                                    { index: true, element: <AnnouncementsPage /> },
                                    { path: "create", element: <CreateAnnouncementPage /> }
                                ]
                            },
                            { path: "management", element: <CollegeManagement /> },
                            { path: "finance", element: <FinancialCenterPage /> },
                            // Trigger true 404 for bad admin routes
                            { path: "*", loader: throwNotFound }
                        ]
                    }
                ],
            },
            {
                // LECTURER PORTAL
                path: "/lecturer",
                element: <PortalLayout navItems={lecturerNavItems} />,
                children: [
                    {
                        errorElement: <PortalErrorPage />,
                        children: [
                            { index: true, element: <LecturerDashboard /> },
                            { path: "dashboard", element: <LecturerDashboard /> },
                            { path: "course/:courseId", element: <ManageCourse /> },
                            // Trigger true 404 for bad lecturer routes
                            { path: "*", loader: throwNotFound }
                        ]
                    }
                ],
            },
            {
                // STUDENT PORTAL
                path: "/student",
                element: <PortalLayout navItems={studentNavItems} />,
                children: [
                    {
                        errorElement: <PortalErrorPage />,
                        children: [
                            { path: "dashboard", element: <StudentDashboard /> },
                            {
                                path: "academics",
                                children: [
                                    { index: true, element: <StudentAcademics /> },
                                    { path: "course/:courseId", element: <CourseDetails /> },
                                ]
                            },
                            { path: "exams", element: <Exams /> },
                            { path: "fees", element: <StudentFees /> },
                            { path: "settings", element: <StudentSettings /> },
                            // Trigger true 404 for bad student routes
                            { path: "*", loader: throwNotFound }
                        ]
                    }
                ],
            },
            // Catch completely disconnected root URLs (e.g., /totally-fake)
            { path: "*", loader: throwNotFound }
        ]
    }
]);