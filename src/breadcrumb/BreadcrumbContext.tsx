import {createContext, useContext, useState} from "react";

const BreadcrumbContext = createContext({
    breadcrumbs: [] as string[], setBreadcrumbs: (breadcrumbs: string[]) => {
        console.log(breadcrumbs);
    }
});

// @ts-expect-error explicit any
export const BreadcrumbProvider = ({children}) => {
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

    return (
        <BreadcrumbContext.Provider value={{breadcrumbs, setBreadcrumbs}}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);