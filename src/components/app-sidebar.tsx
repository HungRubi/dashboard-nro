import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconPhotoOff,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { useAuth } from "@/stores/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    { title: "Tổng quan", url: "/", icon: IconDashboard },
    { title: "Nhân vật", url: "/nhan-vat", icon: IconUsers },
    { title: "Ảnh lỗi", url: "/tai-nguyen-thieu", icon: IconPhotoOff },
    { title: "Tài khoản", url: "#", icon: IconListDetails },
    { title: "Nạp thẻ", url: "#", icon: IconChartBar },
    { title: "Giftcode", url: "#", icon: IconFolder },
    { title: "Bài viết", url: "#", icon: IconFileDescription },
  ],
  navSecondary: [
    { title: "Cài đặt", url: "#", icon: IconSettings },
    { title: "Trợ giúp", url: "#", icon: IconHelp },
    { title: "Tìm kiếm", url: "#", icon: IconSearch },
  ],
  documents: [
    { name: "Thư viện dữ liệu", url: "#", icon: IconDatabase },
    { name: "Báo cáo", url: "#", icon: IconReport },
  ],
};

function SidebarFooterUser() {
  const user = useAuth((s) => s.user);
  if (!user) return null;
  return <NavUser user={{ name: user.username, email: "Quản trị viên", avatar: "" }} />;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Ngọc Rồng</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterUser />
      </SidebarFooter>
    </Sidebar>
  );
}
