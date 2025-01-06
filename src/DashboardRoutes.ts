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
    title: "Venda de items solo",
    icon: "box",
    link: "/standalone",
  },
  {
    id: uuid(),
    title: 'Finanças',
    icon: 'dollar-sign',
    admin: true,
    children: [
      {
        id: uuid(),
        link: "/finance/accounts/list/",
        name: "Contas",
      },
      {
        id: uuid(),
        link: "/finance/transation/list/",
        name: "Transações",
      },
      {
        id: uuid(),
        link: '/finance/categories',
        name: 'Categorias'
      },
      {
        id: uuid(),
        link: "/finance/transation/list/transfer",
        name: "Movimentação entre contas",
      },
      {
        id: uuid(),
        link: "/finance/analysis/spending",
        name: "Analise dos Gastos",
      },
      {
        id: uuid(),
        link: "/finance/cashflow",
        name: "CashFlow",
      },
    ]
  },
];
