import { useEffect } from "react";
import { useNavigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginRedirect,
});

function LoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/admin/login" });
  }, [navigate]);

  return null;
}
