// Import node module libraries
import React, { Suspense } from "react";
import { Outlet } from "react-router";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {HashLoader} from "react-spinners";
import EditEventPage from "pages/dashboard/events/EventPage.tsx";
import EventsPage from "pages/dashboard/events/EventsPage.tsx";
import MeetingManagement from "pages/dashboard/MeetingsPage.tsx";
import SalesDashboard from "pages/dashboard/events/EventSalePage.tsx";
import TicketSalesPage from "pages/dashboard/events/EventTicketsPage.tsx";
import SearchEventsPage from "pages/dashboard/events/SearchEventsPage.tsx";
import {AuthProvider} from "components/auth/AuthProvider.tsx";
import { useAuth } from 'hooks/useAuth';
import ProfileManagement from "pages/dashboard/ProfilePage.tsx";
import CategoriesPage from "pages/dashboard/finance/CategoriesPage.tsx";
import TransferHistory from "pages/dashboard/finance/TransferHistoryPage.tsx";
import CashflowForecastPage from "pages/dashboard/finance/CashflowForecastPage.tsx";
import TransactionsPage from "pages/dashboard/finance/TransactionsPage.tsx";
import CategorySpendingAnalysisComponent from "pages/dashboard/finance/CategorySpendingAnalysisPage.tsx";
import AccountsPage from "pages/dashboard/finance/AccountsPage.tsx";
import TransactionReceiptPage from "pages/dashboard/finance/TransactionReceiptPage.tsx";

const AuthenticationLayout = React.lazy(() => import("layouts/AuthenticationLayout"));
const RootLayout = React.lazy(() => import("layouts/RootLayout"));

const SignIn = React.lazy(() => import("./pages/auth/SignIn"));
const SignUp = React.lazy(() => import("pages/auth/SignUp"));
const Dashboard = React.lazy(() => import("pages/dashboard/Index"));
const NotFound = React.lazy(() => import("pages/dashboard/pages/NotFound"));


interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <HashLoader />
    </div>
);

const App = () => {
  const router = createBrowserRouter([
    {
      id: "root",
      path: "/",
      element: (
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        {
          id: "dashboard",
          path: "/",
          Component: Dashboard,
        },
        {
          id: "meeting",
          path: "/meeting",
          Component: MeetingManagement,
        },
        {
          id: "search",
          path: "/search",
          Component: SearchEventsPage,
        },
        {
          id: "events",
          path: "/event",
          children: [
            {
              id: "event-list",
              path: "/event/",
              Component: EventsPage,
            },
            {
              id: "edit-event",
              path: "/event/:id",
              element: (
                  <AdminRoute>
                    <EditEventPage />
                  </AdminRoute>
              ),
            }
          ],
        },
        {
          id: "finance",
          path: "/finance",
          element: (
              <AdminRoute>
                <Outlet />
              </AdminRoute>
          ),
          children: [
            {
              id: "finance-list",
              path: "/finance/transation/list",
              Component: TransactionsPage,
            },
            {
              id: "l-transfer",
              path: "/finance/transation/list/transfer",
              Component: TransferHistory,
            },
            {
              id: "transaction",
              path: "/finance/transactions/:id",
              Component: TransactionReceiptPage,
            },
            {
              id: "l-accounts",
              path: "/finance/accounts/list/",
              Component: AccountsPage,
            },
            {
              id: "s-analysis",
              path: "/finance/analysis/spending",
              Component: CategorySpendingAnalysisComponent,
            },
            {
              id: "cash-flow",
              path: "/finance/cashflow",
              Component: CashflowForecastPage,
            },
            {
              id: "f-categories",
              path: "/finance/categories",
              Component: CategoriesPage,
            },
          ],
        },
        {
          id: "sale-event",
          path: "/sale/:id",
          Component: SalesDashboard,
        },
        {
          id: "sale-ticket",
          path: "ticket/:eventId",
          Component: TicketSalesPage,
        },
        {
          path: '/profile',
          element: <ProfileManagement />
        }
      ],
    },
    {
      id: "auth",
      path: "/auth",
      Component: AuthenticationLayout,
      children: [
        {
          id: "sign-in",
          path: "sign-in",
          Component: SignIn,
        },
        {
          id: "sign-up",
          path: "sign-up",
          Component: SignUp,
        },
      ],
    },
  ]);

  return (
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
  );
};

export default App;