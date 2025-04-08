"use client";

import * as React from "react";
import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, Separator } from "ui";
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
            <NavigationMenuTrigger>
              {item.icon && <item.icon className="h-4 w-4 mr-2" />}
              {item.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[320px] p-0">
                <div className="border-b p-3 bg-muted/30">
                  <h3 className="font-medium text-sm">{item.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
                <ul className="py-2">
                  {item.items.map((subItem) => (
                    <ListItem 
                      key={subItem.href} 
                      href={subItem.href} 
                      title={subItem.label}
                      icon={subItem.icon}
                    />
                  ))}
                </ul>
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
  icon?: any;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ href, title, icon: Icon }, ref) => (
    <li>
      <Link 
        href={href} 
        ref={ref} 
        className="flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
      >
        {Icon && <Icon className="h-4 w-4 mr-2 opacity-70" />}
        {title}
      </Link>
    </li>
  )
);

ListItem.displayName = "ListItem"; 