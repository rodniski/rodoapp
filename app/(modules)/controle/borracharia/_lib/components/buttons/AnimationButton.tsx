"use client";

import {useState} from "react";
import {Button, DialogTrigger, DropdownMenuTrigger, SheetTrigger} from "ui";
import {AnimatePresence, motion} from "motion/react";
import {PopoverTrigger} from "@radix-ui/react-popover";
import {cn} from "utils";

interface AnimatedButtonProps {
    text: React.ReactNode; // Permite strings ou elementos JSX
    icon: React.ReactNode; // Ícone que será exibido no botão
    variant?: "default" | "secondary" | "destructive" | "ghost" | "outline" | "success"; // Variantes do botão
    isSheet?: boolean; // Indica se deve ser um SheetTrigger
    isDropdown?: boolean; // Indica se deve ser um DropdownMenuTrigger
    isPopover?: boolean; // Indica se deve ser um PopoverTrigger
    isDialog?: boolean; // Indica se deve ser um PopoverTrigger
    onClick?: () => void; // Função opcional para o clique do botão
    disabled?: boolean; // Adiciona suporte para desabilitar o botão
}

export function AnimatedButton({
                                   text,
                                   icon,
                                   variant = "secondary",
                                   isSheet = false,
                                   isDropdown = false,
                                   isPopover = false,
                                   isDialog = false,
                                   onClick,
                                   disabled = false,
                               }: AnimatedButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const isTextForeground = variant === "secondary" || variant === "outline";
    const ButtonContent = (
        <motion.div
            initial={false}
            animate={{
                width: isHovered ? "auto" : "fit-content",
            }}
            transition={{duration: 0.3}}
        >
            <Button
                className={cn(
                    "lg:overflow-hidden whitespace-nowrap text-sans font-bold",
                    {
                        "text-foreground": isTextForeground,
                        "text-white": !isTextForeground,
                    }
                )}
                variant={variant}
                onMouseEnter={() => !disabled && setIsHovered(true)}
                onMouseLeave={() => !disabled && setIsHovered(false)}
                onClick={onClick}
                disabled={disabled} // Aplica a propriedade disabled ao botão
            >
                {icon}
                <AnimatePresence>
                    {isHovered && !disabled && (
                        <motion.span
                            className={cn("ml-2 inline-flex", {
                                "text-foreground": isTextForeground,
                                "text-white": !isTextForeground,
                            })}
                            initial={{width: 0, opacity: 0}}
                            animate={{width: "auto", opacity: 1}}
                            exit={{width: 0, opacity: 0}}
                            transition={{duration: 0.3}}
                        >
                            {/* Renderiza o texto dinâmico */}
                            {typeof text === "string"
                                ? text.split("").map((char, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{delay: index * 0.05}}
                                    >
                                        {char}
                                    </motion.span>
                                ))
                                : text}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Button>
        </motion.div>
    );

    if (isSheet) {
        return <SheetTrigger asChild>{ButtonContent}</SheetTrigger>;
    }

    if (isDropdown) {
        return <DropdownMenuTrigger asChild>{ButtonContent}</DropdownMenuTrigger>;
    }

    if (isPopover) {
        return <PopoverTrigger asChild>{ButtonContent}</PopoverTrigger>;
    }

    if (isDialog) {
        return <DialogTrigger asChild>{ButtonContent}</DialogTrigger>;
    }

    return ButtonContent;
}
