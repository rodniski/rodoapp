"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "lib";
import { useEffect, useRef, useState } from "react";

interface VercelTabProps {
  tabs: { label: string; value: string }[];
  defaultValue?: string;
  content: Record<string, React.ReactNode>;
}

export function VercelTab({ tabs, defaultValue, content }: VercelTabProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const el = tabRefs.current[hoveredIndex];
      if (el)
        setHoverStyle({
          left: `${el.offsetLeft}px`,
          width: `${el.offsetWidth}px`,
        });
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const el = tabRefs.current[activeIndex];
    if (el)
      setActiveStyle({
        left: `${el.offsetLeft}px`,
        width: `${el.offsetWidth}px`,
      });
  }, [activeIndex]);

  useEffect(() => {
    const el = tabRefs.current[0];
    if (el)
      setActiveStyle({
        left: `${el.offsetLeft}px`,
        width: `${el.offsetWidth}px`,
      });
  }, []);

  return (
    <TabsPrimitive.Root defaultValue={defaultValue ?? tabs[0].toLowerCase()}>
      <div className="w-full">
        <div className="relative border-b border-muted pb-3">
          {/* Hover background */}
          <div
            className="absolute h-[30px] transition-all duration-300 ease-out bg-muted/50 dark:bg-white/10 rounded-[6px]"
            style={{ ...hoverStyle, opacity: hoveredIndex !== null ? 1 : 0 }}
          />

          {/* Active underline */}
          <div
            className="absolute bottom-[-2px] h-[2px] bg-primary transition-all duration-300 ease-out"
            style={activeStyle}
          />

          <TabsPrimitive.List className="relative flex space-x-1 items-center">
            {tabs.map(({ label, value }, index) => (
              <TabsPrimitive.Trigger key={value} value={value} asChild>
                <div
                  ref={(el) => (tabRefs.current[index] = el)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors",
                    index === activeIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {label}
                </div>
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {tabs.map(({ value }) => (
            <TabsPrimitive.Content key={value} value={value}>
              {content[value]}
            </TabsPrimitive.Content>
          ))}
        </div>
      </div>
    </TabsPrimitive.Root>
  );
}
