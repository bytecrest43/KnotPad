"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {  signUpUser } from "@/server/users";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

// Validation schema
const formSchema = z
  .object({
    name: z.string().min(2, "Name is too short").max(100),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Google Icon + Label Button
const GoogleSignUpButton = ({ onClick }: { onClick?: () => void }) => (
  <Button
    type="button"
    variant="outline"
    className="w-full flex items-center justify-center gap-3"
    onClick={onClick}
  >
    <svg
      className="w-5 h-5"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C34.4 32.3 30 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C34.6 4.5 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.3 15.1 18.8 12 24 12c3.1 0 5.9 1.2 8 3.1l6-6C34.6 4.5 29.6 2 24 2c-7.4 0-13.8 3.8-17.7 9.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.8 0 10.6-1.9 14.1-5.3l-6.6-5.5C29.8 34.4 27 35 24 35c-6.4 0-11.7-4.3-13.6-10.1l-6.5 5C8.2 39.2 15.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.6 5.4-6.3 6.9l6.6 5.5C38.9 37.4 43 31.7 43 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
    <span className="text-sm font-medium">Sign up with Google</span>
  </Button>
);

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await signUpUser(
        values.name,
        values.email,
        values.password
      );
      if (response.success) {
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="mx-auto w-full max-w-5xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-[1.3fr_1fr]">
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 p-6 md:p-8"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Sign up</h1>
                      <p className="text-muted-foreground text-balance">
                        Create an account to start organizing your notes and tasks.
                      </p>
                    </div>

                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="mail@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Sign up"}
                    </Button>

                    {/* Divider */}
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or continue with
                      </span>
                    </div>

                    {/* Google Button */}
                    <div className="grid grid-cols-1 gap-4">
                      <GoogleSignUpButton />
                    </div>

                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <Link href="/login" className="underline underline-offset-4">
                        Login
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>

            {/* Image section */}
            <div className="bg-muted relative hidden md:block">
              <Image
                src="/register.gif"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7] dark:grayscale"
                width={1500}
                height={1500}
              />
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <div className="text-muted-foreground text-center text-xs *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <Link href="">Terms of Service</Link> and{" "}
          <Link href="">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
