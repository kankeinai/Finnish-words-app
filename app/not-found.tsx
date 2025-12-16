import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/" passHref>
          <Button>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

