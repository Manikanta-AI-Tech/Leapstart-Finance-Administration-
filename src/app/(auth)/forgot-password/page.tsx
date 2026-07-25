"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    setIsLoading(true);

    try {
      const { error: resetError } = await authService.resetPassword(data.email);

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full",
        "flex flex-col items-center justify-center",
        "p-4 sm:p-6",
        "bg-gradient-to-br from-neutral-50 via-white to-primary-50/30",
        "dark:from-neutral-950 dark:via-neutral-950 dark:to-primary-950"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.5,
        }}
        className={cn(
          "w-full max-w-sm",
          "bg-white dark:bg-neutral-900",
          "rounded-lg",
          "border border-neutral-200/60 dark:border-neutral-800",
          "shadow-xl",
          "p-8"
        )}
      >
        {/* Logo + Brand */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center mb-8"
        >
          <div
            className={cn(
              "flex items-center justify-center",
              "w-14 h-14 rounded-lg",
              "bg-gradient-to-br from-primary-600 to-primary-500",
              "shadow-button-primary",
              "mb-4"
            )}
          >
            <span className="text-white font-bold text-xl tracking-tight">
              LS
            </span>
          </div>
        </motion.div>

        {isSuccess ? (
          /* Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div
              className={cn(
                "flex items-center justify-center",
                "w-16 h-16 rounded-full",
                "bg-success-50 dark:bg-success-900/30",
                "border border-success-200 dark:border-success-800"
              )}
            >
              <CheckCircle2 className="w-8 h-8 text-success-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Check your email
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                We&apos;ve sent a password reset link to your email address.
                Please check your inbox and follow the instructions.
              </p>
            </div>
            <Link
              href="/login"
              className={cn(
                "inline-flex items-center gap-2",
                "text-sm font-medium",
                "text-primary-600 dark:text-primary-400",
                "hover:text-primary-700 dark:hover:text-primary-300",
                "transition-colors duration-150",
                "mt-4"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Forgot your password?
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mb-6 p-3 rounded-md",
                  "bg-destructive-50 dark:bg-destructive-900/30",
                  "border border-destructive-200 dark:border-destructive-800",
                  "flex items-start gap-2"
                )}
              >
                <AlertCircle className="w-4 h-4 text-destructive-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive-700 dark:text-destructive-300">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2",
                      "w-[18px] h-[18px] text-neutral-400 dark:text-neutral-500",
                      "pointer-events-none"
                    )}
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@leapstart.edu"
                    {...register("email")}
                    className={cn(
                      "block w-full h-11 pl-10 pr-4 rounded-md",
                      "text-sm text-neutral-900 dark:text-white",
                      "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
                      "bg-white dark:bg-neutral-900",
                      "border",
                      errors.email
                        ? "border-destructive-300 dark:border-destructive-700 focus:border-destructive-400"
                        : "border-neutral-200 dark:border-neutral-700 focus:border-primary-400 dark:focus:border-primary-500",
                      "focus:outline-none focus:shadow-input-focus",
                      "transition-all duration-150"
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive-500 dark:text-destructive-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={isLoading ? undefined : { scale: 0.98 }}
                className={cn(
                  "w-full h-11 rounded-md",
                  "bg-gradient-to-t from-primary-600 to-primary-500",
                  "text-white text-sm font-medium",
                  "shadow-button-primary hover:shadow-button-hover",
                  "hover:from-primary-700 hover:to-primary-600",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-150",
                  "dark:from-primary-500 dark:to-primary-400",
                  "dark:hover:from-primary-600 dark:hover:to-primary-500",
                  "flex items-center justify-center gap-2"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </motion.button>
            </form>

            {/* Back to login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center gap-2",
                  "text-sm font-medium",
                  "text-primary-600 dark:text-primary-400",
                  "hover:text-primary-700 dark:hover:text-primary-300",
                  "transition-colors duration-150"
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          </>
        )}
      </motion.div>

      {/* Footer */}
      <p className="mt-8 text-xs text-neutral-400 dark:text-neutral-600">
        &copy; 2026 LeapStart School of Technology. All rights reserved.
      </p>
    </div>
  );
}
