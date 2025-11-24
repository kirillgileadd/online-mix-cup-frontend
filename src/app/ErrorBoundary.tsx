import { Button, Title, Text, Stack, Center } from "@mantine/core";
import { IconHome, IconAlertTriangle } from "@tabler/icons-react";
import { Component, type ReactNode } from "react";
import { ROUTES } from "../shared/routes";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleGoHome = () => {
    window.location.href = ROUTES.publicTournaments;
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Center className="min-h-[60vh] p-6">
          <Stack align="center" gap="lg" maw={600}>
            <IconAlertTriangle
              size={64}
              stroke={1.5}
              color="var(--mantine-color-red-6)"
            />
            <Title order={1} size="2rem">
              Произошла ошибка
            </Title>
            <Text c="dimmed" size="lg" ta="center">
              К сожалению, произошла непредвиденная ошибка. Пожалуйста,
              попробуйте обновить страницу или вернуться на главную.
            </Text>
            {this.state.error && import.meta.env.DEV && (
              <Text
                size="sm"
                c="red"
                style={{
                  fontFamily: "monospace",
                  backgroundColor: "var(--mantine-color-gray-0)",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  width: "100%",
                  wordBreak: "break-word",
                }}
              >
                {this.state.error.message}
              </Text>
            )}
            <Button
              leftSection={<IconHome size={16} />}
              onClick={this.handleGoHome}
              size="md"
              mt="md"
            >
              Вернуться на главную
            </Button>
          </Stack>
        </Center>
      );
    }

    return this.props.children;
  }
}
