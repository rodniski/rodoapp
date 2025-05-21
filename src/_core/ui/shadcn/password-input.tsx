"use client";

import * as React from "react";
import { cn } from "utils";
import { Input } from "ui";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "motion/react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={showPassword ? "text" : "password"}
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 90 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              className="absolute inset-0 transform origin-top"
            >
              <Input
                type={showPassword ? "text" : "password"}
                className={cn("pr-8 sm:pr-9 lg:pr-10 fhd:pr-12 qhd:pr-16 bg-transparent border shadow-none focus-visible:ring-0", className)}
                ref={ref}
                value={value}
                {...props}
              />
            </motion.div>
          </AnimatePresence>
          {/* Input invisível para manter o layout e interatividade */}
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-8 sm:pr-9 lg:pr-10 fhd:pr-12 qhd:pr-16 opacity-0 pointer-events-none", className)}
            value={value}
            tabIndex={-1}
            {...props}
          />
        </div>
        <button
          type="button"
          className="absolute right-0 top-0 h-full aspect-square flex justify-center items-center border-l"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <AnimatePresence mode="wait">
            {showPassword ? (
              <motion.div
                key="eye-open"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <EyeOpenIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 fhd:h-5 fhd:w-5 qhd:size-7 text-muted-foreground" />
              </motion.div>
            ) : (
              <motion.div
                key="eye-closed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <EyeClosedIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 fhd:h-5 fhd:w-5 qhd:size-7 text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };