import { AppSidebar } from "@/assets/components/ui/app-sidebar";
import { SiteHeader } from "@/assets/components/ui/site-header";
import { SidebarInset, SidebarProvider } from "@/assets/components/ui/sidebar";
import { SearchForm } from "@/assets/components/ui/search-form";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

export default function HomePage() {
  return (
    <div className="[--header-height:calc(--spacing(14))] p-4">
      <SearchForm className="w-full sm:mr-auto sm:w-auto p-4" />
      <div className="flex flex-1 flex-col gap-4 pr-4">
        {/* <h1>jdhsfjds</h1> */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </div>
  );
}
