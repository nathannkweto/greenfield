import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import PortalLayout from "./layouts/PortalLayout";

// Auth Guards
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireRole } from "./components/auth/RequireRole";

// Error Pages & Utilities
import GlobalErrorPage from "./components/errors/GlobalErrorPage";
import PortalErrorPage from "./components/errors/PortalErrorPage";
import PageTransition from "./components/PageTransition";
import { adminNavItems, lecturerNavItems, studentNavItems, applicantNavItems } from "./config/navItems";

// Public Pages
import LandingPage from "./pages/public/LandingPage";
import ProgramsPage from "./pages/public/ProgramsPage";
import ContactPage from "./pages/public/ContactPage";
import ProgramDetailsPage from "./pages/public/ProgramDetailsPage";
import ApplyPage from "./pages/public/ApplyPage";
import LoginPage from "./pages/public/LoginPage";
import TermsOfServicePage from "./pages/public/TermsOfServicePage";

// Applicant Pages
import ApplicantDashboard from "./pages/applicant/Dashboard/Page";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard/Page";
import StudentAcademics from "./pages/student/StudentAcademics/Page";
import CourseDetails from "./pages/student/CourseDetailPage/Page";
import Exams from "./pages/student/StudentExams";
import StudentSettings from "./pages/student/StudentSettings";

// Lecturer Pages
import LecturerDashboard from "./pages/lecturer/LecturerDashboard/Page";
import ManageCourse from "./pages/lecturer/ManageCourse/Page";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard/Page";
import CollegeManagement from "./pages/admin/ManagementPage/Page";
import StudentsPage from "./pages/admin/StudentsPage/Page";
import StudentDetailsPage from "./pages/admin/StudentDetailsPage/Page";
import AnnouncementsPage from "./pages/admin/AnnouncementsPage/Page";
import CreateAnnouncementPage from "./pages/admin/CreateAnnouncementPage/Page";
import AdminAccountsPage from "./pages/admin/AdminAccountsPage/Page";
import ResultsPage from "./pages/admin/ResultsPage/Page";
import SchoolDetailsPage from "./pages/admin/SchoolDetailsPage/Page";
import AdminProgramDetailsPage from "./pages/admin/ProgramDetailsPage/Page";
import LecturerDetailsPage from "./pages/admin/LecturerDetailsPage/Page";
import NotificationDetailPage from "./pages/shared/NotificationDetailPage";
import ApplicationPage from "./pages/applicant/Application/Page.tsx";

const throwNotFound = () => {
    throw new Response("Not Found", { status: 404 });
};

export const router = createBrowserRouter([
    {
        errorElement: <GlobalErrorPage />,
        children: [
            {
                // PUBLIC ROUTES
                path: "/",
                element: <PublicLayout />,
                children: [
                    {
                        element: <PageTransition />,
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
                            { path: "terms", element: <TermsOfServicePage /> },
                            { path: "*", loader: throwNotFound }
                        ]
                    }
                ]
            },
            {
                // PROTECTED PORTAL GROUP
                element: <RequireAuth />,
                children: [
                    {
                        // ADMIN PORTAL
                        path: "admin",
                        element: <RequireRole allowedRoles={['admin']} />,
                        children: [
                            {
                                element: <PortalLayout navItems={adminNavItems} />,
                                children: [
                                    {
                                        errorElement: <PortalErrorPage />,
                                        children: [
                                            { index: true, element: <Navigate to="dashboard" replace /> },
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
                                                    { path: "create", element: <CreateAnnouncementPage /> },
                                                    { path: ":announcementId/edit", element: <CreateAnnouncementPage /> }
                                                ]
                                            },
                                            {
                                                path: "notifications",
                                                children: [
                                                    { index: true, element: <NotificationDetailPage /> }
                                                ]
                                            },
                                            {
                                                path: "management",
                                                children: [
                                                    { index: true, element: <CollegeManagement /> },
                                                    { path: "schools/:schoolId", element: <SchoolDetailsPage /> },
                                                    { path: "programs/:programId", element: <AdminProgramDetailsPage /> },
                                                    { path: "lecturers/:lecturerId", element: <LecturerDetailsPage /> }
                                                ]
                                            },
                                            { path: "administrators", element: <AdminAccountsPage /> },
                                            { path: "results", element: <ResultsPage /> },
                                            { path: "*", loader: throwNotFound }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        // LECTURER PORTAL
                        path: "lecturer",
                        element: <RequireRole allowedRoles={['lecturer']} />,
                        children: [
                            {
                                element: <PortalLayout navItems={lecturerNavItems} />,
                                children: [
                                    {
                                        element: <PageTransition />,
                                        errorElement: <PortalErrorPage />,
                                        children: [
                                            { index: true, element: <Navigate to="dashboard" replace /> },
                                            { path: "dashboard", element: <LecturerDashboard /> },
                                            { path: "course/:courseId", element: <ManageCourse /> },
                                            { path: "*", loader: throwNotFound }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        // APPLICANT PORTAL
                        path: "applicant",
                        element: <RequireRole allowedRoles={['applicant']} />,
                        children: [
                            {
                                element: <PortalLayout navItems={applicantNavItems} />,
                                children: [
                                    {
                                        element: <PageTransition />,
                                        errorElement: <PortalErrorPage />,
                                        children: [
                                            { index: true, element: <Navigate to="dashboard" replace /> },
                                            { path: "dashboard", element: <ApplicantDashboard /> },
                                            { path: "application", element: <ApplicationPage /> },
                                            { path: "*", loader: throwNotFound }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        // STUDENT PORTAL
                        path: "student",
                        element: <RequireRole
                            allowedRoles={['student']}
                            allowedStatuses={['registered', 'suspended']}
                        />,
                        children: [
                            {
                                element: <PortalLayout navItems={studentNavItems} />,
                                children: [
                                    {
                                        element: <PageTransition />,
                                        errorElement: <PortalErrorPage />,
                                        children: [
                                            { index: true, element: <Navigate to="dashboard" replace /> },
                                            { path: "dashboard", element: <StudentDashboard /> },
                                            {
                                                path: "academics",
                                                children: [
                                                    { index: true, element: <StudentAcademics /> },
                                                    { path: "course/:courseId", element: <CourseDetails /> }
                                                ]
                                            },
                                            { path: "exams", element: <Exams /> },
                                            { path: "settings", element: <StudentSettings /> },
                                            { path: "*", loader: throwNotFound }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            { path: "*", loader: throwNotFound }
        ]
    }
]);