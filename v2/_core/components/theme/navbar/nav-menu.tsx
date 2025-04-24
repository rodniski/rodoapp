"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  Separator,
} from "ui";
import { NavGroup, NavItem } from ".";
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
        {items.map((group) => (
          <NavigationMenuItem
            key={group.id}
            className="m-0 flex list-none items-center rounded p-1"
          >
            <NavigationMenuTrigger>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {group.icon && (
                  <group.icon className="size-5 lg:size-6 fhd:size-7 qhd:size-8" />
                )}
                <span className="text-sm lg:text-base qhd:text-xl">
                  {group.label}
                </span>
              </motion.div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <motion.div
                // Responsividade com Tailwind
                className="flex flex-col w-full gap-2 p-2 sm:p-0 sm:flex-row sm:w-[380px] lg:w-[450px] fhd:w-[500px] qhd:w-[600px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Painel de preview */}
                <div className="p-3 bg-background rounded-md shadow flex flex-col justify-end h-[150px] w-full overflow-hidden sm:h-[255px] lg:h-[280px] fhd:h-[340px] qhd:h-[350px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={hoveredItem ? hoveredItem.label : group.label}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-start"
                    >
                      {(hoveredItem ? hoveredItem.icon : group.icon) && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mb-2"
                        >
                          {React.createElement(
                            hoveredItem ? hoveredItem.icon : group.icon,
                            { className: "size-6 sm:size-8 text-primary" }
                          )}
                        </motion.div>
                      )}
                      <h3 className="font-medium text-base sm:text-lg lg:text-xl fhd:text-2xl qhd:text-3xl text-start">
                        {hoveredItem ? hoveredItem.label : group.label}
                      </h3>
                      <motion.p
                        key={
                          hoveredItem
                            ? hoveredItem.description
                            : group.description
                        }
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="text-xs sm:text-sm lg:text-base fhd:text-lg qhd:text-xl text-muted-foreground mt-1"
                      >
                        {hoveredItem
                          ? hoveredItem.description
                          : group.description}
                      </motion.p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                {/* Lista de subgrupos */}
                <div className="flex flex-col w-full">
                  {group.subGroups.map((subGroup, index) => (
                    <div key={subGroup.id} className="mb-2">
                      {subGroup.title && (
                        <h4 className="px-3 py-1 font-semibold text-xs sm:text-sm lg:text-base tracking-wide text-muted-foreground">
                          {subGroup.title}
                        </h4>
                      )}
                      <ul className="">
                        {subGroup.items.map((subItem) => (
                          <ListItem
                            key={subItem.href}
                            href={subItem.href}
                            title={subItem.label}
                            onMouseEnter={() => {
                              setHoveredItem(subItem);
                              setActiveGroup(group);
                            }}
                            onMouseLeave={() => {
                              setHoveredItem(null);
                              setActiveGroup(null);
                            }}
                          />
                        ))}
                      </ul>
                      {/* Adiciona o Separator somente se não for o último item */}
                      {index < group.subGroups.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
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
    <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
      <Link
        href={href}
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="flex w-full cursor-pointer select-none items-center rounded px-3 py-1.5 text-xs sm:text-sm lg:text-base fhd:text-lg qhd:text-xl outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        {title}
      </Link>
    </motion.li>
  )
);

ListItem.displayName = "ListItem";
