import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Leaf } from "lucide-react";
import Link from "next/link";

const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
    </svg>
)

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 font-bold mb-2">
                <Leaf className="h-8 w-8 text-primary" />
                <span className="font-headline text-3xl">CarbonTrace</span>
            </Link>
            <p className="text-muted-foreground">Log in to start tracking your carbon footprint.</p>
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
            <CardDescription>
              Choose your preferred sign-in method.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard">
                    <WalletIcon className="mr-2 h-4 w-4" />
                    Login with MetaMask
                </Link>
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" asChild>
                <Link href="/dashboard">Login with Email</Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                    href="#"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Sign up
                </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
