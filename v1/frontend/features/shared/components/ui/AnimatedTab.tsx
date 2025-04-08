"use client"

import {useCallback, useEffect, useRef, useState} from "react"
import {Card, CardContent} from "ui"

interface AnimatedTabProps {
    tabs: string[]
    onTabChange?: (index: number) => void
    className?: string
    activeTabClassName?: string
    inactiveTabClassName?: string
}

export function AnimatedTab({
                                tabs,
                                onTabChange,
                                className = "",
                                activeTabClassName = "text-[#0e0e10] dark:text-white",
                                inactiveTabClassName = "text-[#0e0f1199] dark:text-[#ffffff99]",
                            }: AnimatedTabProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [hoverStyle, setHoverStyle] = useState({})
    const [activeStyle, setActiveStyle] = useState({left: "0px", width: "0px"})
    const tabRefs = useRef<(HTMLDivElement | null)[]>([])

    const setTabRef = useCallback(
        (index: number) => (el: HTMLDivElement | null) => {
            tabRefs.current[index] = el
        },
        [],
    )

    useEffect(() => {
        if (hoveredIndex !== null) {
            const hoveredElement = tabRefs.current[hoveredIndex]
            if (hoveredElement) {
                const {offsetLeft, offsetWidth} = hoveredElement
                setHoverStyle({
                    left: `${offsetLeft}px`,
                    width: `${offsetWidth}px`,
                })
            }
        }
    }, [hoveredIndex])

    useEffect(() => {
        const activeElement = tabRefs.current[activeIndex]
        if (activeElement) {
            const {offsetLeft, offsetWidth} = activeElement
            setActiveStyle({
                left: `${offsetLeft}px`,
                width: `${offsetWidth}px`,
            })
        }
    }, [activeIndex])

    useEffect(() => {
        requestAnimationFrame(() => {
            const firstElement = tabRefs.current[0]
            if (firstElement) {
                const {offsetLeft, offsetWidth} = firstElement
                setActiveStyle({
                    left: `${offsetLeft}px`,
                    width: `${offsetWidth}px`,
                })
            }
        })
    }, [])

    const handleTabClick = (index: number) => {
        setActiveIndex(index)
        if (onTabChange) {
            onTabChange(index)
        }
    }

    return (
        <Card className={`border-none shadow-none relative flex items-center justify-center ${className}`}>
            <CardContent className="p-0">
                <div className="relative">
                    {/* Hover Highlight */}
                    <div
                        className="absolute h-[50px] transition-all duration-300 ease-out bg-[#0e0f1114] dark:bg-[#ffffff1a] rounded-[6px] flex items-center"
                        style={{
                            ...hoverStyle,
                            opacity: hoveredIndex !== null ? 1 : 0,
                        }}
                    />

                    {/* Active Indicator */}
                    <div
                        className="absolute bottom-[-6px] h-[2px]  transition-all duration-300 ease-out"
                        style={activeStyle}
                    />

                    {/* Tabs */}
                    <div className="relative flex space-x-[6px] items-center">
                        {tabs.map((tab, index) => (
                            <div
                                key={index}
                                ref={setTabRef(index)}
                                className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[50px] ${
                                    index === activeIndex ? activeTabClassName : inactiveTabClassName
                                }`}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => handleTabClick(index)}
                            >
                                <div
                                    className="text-sm leading-5 whitespace-nowrap flex items-center justify-center h-full">
                                    {tab}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

