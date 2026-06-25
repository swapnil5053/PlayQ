import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User } from "lucide-react";
import { AppShell } from "@/components/arcade/shell";
import { Button } from "@/components/arcade/ui";
const Field = ({ icon, ...props }: any) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
      {icon}
    </div>
    <input
      {...props}
      className="w-full rounded-full bg-foreground/5 py-4 pl-12 pr-4 text-sm font-medium outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
    />
  </div>
);

const SocialAuth = () => (
  <div className="flex justify-center gap-4">
    {["Google", "Apple"].map((provider) => (
      <button
        key={provider}
        className="flex h-12 flex-1 items-center justify-center rounded-full bg-foreground/5 text-sm font-semibold transition-colors hover:bg-foreground/10"
      >
        {provider}
      </button>
    ))}
  </div>
);
export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — THE ARCADE" }] }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  return (
    <AppShell withNav={false}>
      <div className="relative min-h-screen px-8 pt-20">
        <div className="absolute inset-0 bg-gradient-nebula" />
        <div className="relative">
          <h1 className="font-display text-3xl">Create account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join the arcade in seconds.</p>

          <div className="mt-8 flex flex-col gap-3">
            <Field icon={<User className="h-5 w-5" />} placeholder="Display name" />
            <Field icon={<Mail className="h-5 w-5" />} type="email" placeholder="Email" />
            <Field icon={<Lock className="h-5 w-5" />} type="password" placeholder="Password" />
            <Field icon={<Lock className="h-5 w-5" />} type="password" placeholder="Confirm password" />
            <Button onClick={() => navigate({ to: "/otp" })}>Sign up</Button>
          </div>

          <p className="my-5 text-center text-xs text-muted-foreground">or continue with</p>
          <SocialAuth />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
