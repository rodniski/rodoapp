import * as React from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import {
	ScrollArea,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "ui";

export function DocSidebar({ items }: any) {
	const [expandedSections, setExpandedSections] = React.useState<string[]>(["TI", "Protheus", "Power BI"])

	const toggleSection = (title: string) => {
		setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
	}

	return (
		<Sidebar className="absolute h-[calc(100vh-50px)] top-12 transition-all duration-300">
			<SidebarContent>
				<ScrollArea className="h-full bg-background/95 backdrop-blur">
					<SidebarGroup>
						{items.map((item: any) => (
							<Collapsible key={item.id} className="mt-4" open={expandedSections.includes(item.title)} onOpenChange={() => toggleSection(item.title)}>
								<CollapsibleTrigger className="w-full text-left text-muted-foreground flex items-center justify-between gap-2 text-sm py-1 mb-3 border-b cursor-pointer hover:text-foreground">
									<div className="flex gap-2 items-center">
										{item.icon && <item.icon className="size-5" />}
										<span>{item.title}</span>
									</div>
									<ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.includes(item.title) ? "rotate-180" : ""
										}`} />
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarGroupContent>
										<SidebarMenu>
											{item.subItem.map((subitem: any) => (
												<SidebarMenuItem key={subitem.id}>
													<SidebarMenuButton asChild className="h-10">
														<Link href={subitem.url} className="text-foreground cursor-pointer">
                              {subitem.title}
                            </Link>
													</SidebarMenuButton>
												</SidebarMenuItem>
											))}
										</SidebarMenu>
									</SidebarGroupContent>
								</CollapsibleContent>
							</Collapsible>
						))}
					</SidebarGroup>
				</ScrollArea>
			</SidebarContent>
		</Sidebar>
	)
}