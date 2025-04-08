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
import { NavGroup } from "./navigation";

interface NavMenuProps {
  items: NavGroup[];
}

export function NavMenu({ items }: NavMenuProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[400px] flex gap-2 p-0">
                <div className="p-3 bg-muted flex flex-col justify-end h-[200px] w-full">
                  <h3 className="font-medium text-sm">{item.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
                <div className="flex flex-col w-full">
                  <ul className="py-1">
                    {item.items.map((subItem) => (
                      <ListItem
                        key={subItem.href}
                        href={subItem.href}
                        title={subItem.label}
                      />
                    ))}
                  </ul>
                </div>
              </div>
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
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ href, title }, ref) => (
    <li>
      <Link
        href={href}
        ref={ref}
        className="flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        {title}
      </Link>
    </li>
  )
);

ListItem.displayName = "ListItem";
