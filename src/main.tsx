import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
// import "@mantine/modals/styles.css";
import "mantine-react-table/styles.css";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { RouterProvider } from "react-router-dom"; //import MRT styles
import { router } from "./app/router";
import { AppPermissionsProvider } from "./shared/authorization.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./app/ErrorBoundary.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="dark">
          <ModalsProvider>
            <AppPermissionsProvider>
              <Notifications />
              <RouterProvider router={router} />
            </AppPermissionsProvider>
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
