import type { Industry } from "@/types/content";

export const logistics: Industry = {
  slug: "logistics",
  name: "Logistics",
  shortWorkflows: ["Fleet", "Shipments", "Drivers", "Fuel", "Maintenance", "Operations"],
  summary:
    "Coordinate fleet, shipments, drivers, fuel and maintenance with real-time operational visibility.",
  icon: "truck",
  priority: 5,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Software for Logistics and Transport Companies",
    intro:
      "Plan shipments, assign vehicles and drivers, control fuel and maintenance costs and give customers accurate status updates, all from one operational system.",
  },
  challenges: [
    {
      title: "Dispatch run from whiteboards and group chats",
      description:
        "Vehicle and driver assignments change through the day and are not recorded in one place.",
    },
    {
      title: "Fuel costs that are hard to verify",
      description:
        "Fuel slips and allowances are reconciled manually, so unusual consumption goes unnoticed.",
    },
    {
      title: "Maintenance handled only after breakdowns",
      description: "Service schedules are not tracked, which leads to avoidable downtime.",
    },
    {
      title: "Customers asking where their shipment is",
      description:
        "Status updates depend on calling the driver, which ties up the operations team.",
    },
  ],
  workflows: [
    { name: "Fleet", description: "Maintain vehicle records, documents and availability." },
    {
      name: "Shipments",
      description: "Create, assign and track shipments from booking to delivery.",
    },
    { name: "Drivers", description: "Manage driver assignments, documents and trip history." },
    {
      name: "Fuel",
      description: "Record fuel purchases per vehicle and compare them with distance travelled.",
    },
    {
      name: "Maintenance",
      description: "Schedule services and record repairs and parts per vehicle.",
    },
    { name: "Operations", description: "Monitor daily trips, delays and costs across the fleet." },
  ],
  solutions: ["custom-software", "business-dashboards", "automation"],
  features: [
    {
      title: "Trip and shipment board",
      description: "A live view of trips planned, in progress and completed.",
    },
    {
      title: "Fuel consumption analysis",
      description: "Spot vehicles whose fuel use is out of line with their trips.",
    },
    {
      title: "Maintenance reminders",
      description: "Automatic alerts for upcoming services and expiring vehicle documents.",
    },
    {
      title: "Delivery status updates",
      description: "Share shipment status with customers without phone calls.",
    },
  ],
  benefits: [
    {
      title: "Better use of the fleet",
      description: "Vehicles and drivers are assigned with a full view of availability.",
    },
    {
      title: "Control of running costs",
      description: "Fuel and maintenance spending is recorded per vehicle and easy to review.",
    },
    {
      title: "Less time spent on status calls",
      description: "Operations and customers can see shipment status directly.",
    },
  ],
  projects: [],
  seo: {
    title: "Logistics and Fleet Management Software",
    description:
      "Logistics software for fleet, shipments, drivers, fuel and maintenance, with dashboards that give operations teams real-time visibility.",
  },
};
