"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export default function ErrorPage({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-xl border border-border">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <Button
            variant="default"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>

          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

// Optional: 404 Page
export function NotFoundPage() {
  return (
    <ErrorPage
      title="404 - Page not found"
      description="The page you are looking for doesn\'t exist or has been moved."
    />
  );
}

// Optional: Next.js App Router error boundary (app/error.tsx)
// export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
//   return (
//     <ErrorPage
//       title="Application Error"
//       description={error.message}
//     />
//   );
// }
