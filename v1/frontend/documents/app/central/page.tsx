"use client";

import {useBreadcrumbs} from "lib";
import React, {useEffect} from "react";
import {dashboardData} from "&/lib";
import {Carousel} from "&/components";

const Page = () => {
    const {setBreadcrumbs} = useBreadcrumbs();


    useEffect(() => {
        setBreadcrumbs([{label: "RodoApp"}]);
    }, [setBreadcrumbs]);

    return (
        <main className="w-full h-full flex flex-col px-8 py-5 overflow-y-auto">

            <div className="h-full flex flex-col justify-center items-start mx-auto">
                {dashboardData.map((category) => (
                    <section key={category.id}>
                        <Carousel cards={category.cards} category={category.title}/>
                    </section>
                ))}
            </div>
        </main>
    );
};

export default Page;