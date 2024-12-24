import { DashboardMenuProps } from "types.ts";
import { v4 as uuid } from "uuid";

export const DashboardMenu: DashboardMenuProps[] = [
  {
    id: uuid(),
    title: "Dashboard",
    icon: "home",
    link: "/",
  },
  {
    id: uuid(),
    title: "Eventos",
    icon: "activity",
    link: "/event/",
  },
  {
    id: uuid(),
    title: "Pesquise eventos",
    icon: "search",
    link: "/search/",
  },
  {
    id: uuid(),
    title: "Reuniões",
    icon: "users",
    link: "/meeting/",
  }
];
