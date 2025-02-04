import {useBreadcrumb} from "@/breadcrumb/BreadcrumbContext.tsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb.tsx";

function BreadcrumbDisplay() {

    const {breadcrumbs} = useBreadcrumb();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                        {breadcrumbs[0]}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block"/>
                <BreadcrumbItem>
                    <BreadcrumbPage>{breadcrumbs[1]}</BreadcrumbPage>
                </BreadcrumbItem>
                {breadcrumbs[2] && <> <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{breadcrumbs[2]}</BreadcrumbPage>
                    </BreadcrumbItem>
                </>}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BreadcrumbDisplay;