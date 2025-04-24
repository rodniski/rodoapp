"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "ui";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "utils";
import { Button } from "ui";
import { DebugStateSheet } from "@inclusao/components";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function AnimatedTabs({
  tabs,
  defaultValue,
  className,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].value);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className={cn("w-screen px-14 h-[calc(100vh-66px)] p-5", className)}
      >
        <div className="flex items-center justify-between">
          <TabsList className="fixed top-[70px] left-1/2 -translate-x-1/2  flex justify-center mx-auto items-center bg-muted">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "px-4 py-4 transition-colors text-lg",
                  activeTab === tab.value
                    ? "bg-background text-primary shadow"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
           </TabsList>
          <div className="flex w-full justify-end">
            <DebugStateSheet />
          </div>
        </div>
        {/* Tab content */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="flex flex-col justify-center items-center"
            >
              <AnimatePresence mode="wait">
                {activeTab === tab.value && (
                  <motion.div
                    key={tab.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col justify-between h-full w-full"
                  >
                    <div className="overflow-y-auto flex-1">{tab.content}</div>

                    {/* Botão fixo na base */}
                    <div className="absolute bottom-0 right-0">
                      <Button onClick={handleNext}>Próximo</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
