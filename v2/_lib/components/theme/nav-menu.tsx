"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Separator,
} from "ui";
import { NavGroup, NavItem } from "./navigation";
import { motion, AnimatePresence } from "motion/react";

interface NavMenuProps {
  items: NavGroup[];
}

export function NavMenu({ items }: NavMenuProps) {
  const [hoveredItem, setHoveredItem] = React.useState<NavItem | null>(null);
  const [activeGroup, setActiveGroup] = React.useState<NavGroup | null>(null);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuTrigger>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </motion.div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <motion.div 
                className="w-[400px] flex gap-2 p-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-3 bg-muted flex flex-col justify-end h-[200px] w-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={hoveredItem ? hoveredItem.label : item.label}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col"
                    >
                      <h3 className="font-medium text-sm">
                        {hoveredItem ? hoveredItem.label : item.label}
                      </h3>
                      <motion.p
                        key={hoveredItem ? hoveredItem.description : item.description}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="text-xs text-muted-foreground mt-1"
                      >
                        {hoveredItem ? hoveredItem.description : item.description}
                      </motion.p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex flex-col w-full">
                  <ul className="py-1">
                    {item.items.map((subItem) => (
                      <ListItem
                        key={subItem.href}
                        href={subItem.href}
                        title={subItem.label}
                        onMouseEnter={() => {
                          setHoveredItem(subItem);
                          setActiveGroup(item);
                        }}
                        onMouseLeave={() => {
                          setHoveredItem(null);
                          setActiveGroup(null);
                        }}
                      />
                    ))}
                  </ul>
                </div>
              </motion.div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface ListItemProps {
  href: string;
  title: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ href, title, onMouseEnter, onMouseLeave }, ref) => (
    <motion.li
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        {title}
      </Link>
    </motion.li>
  )
);

ListItem.displayName = "ListItem";
