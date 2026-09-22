import type { Industry } from "@/types/content";

export const healthcare: Industry = {
  slug: "healthcare",
  name: "Healthcare",
  shortWorkflows: ["Patients", "Appointments", "Consultations", "Billing", "Business Operations"],
  summary:
    "Organize patient records, appointments, consultations and billing for clinics and healthcare businesses.",
  icon: "heart-pulse",
  priority: 7,
  status: "published",
  hasPage: true,
  hero: {
    heading: "Software for Healthcare Businesses",
    intro:
      "Help clinics and healthcare providers run the business side smoothly: patient registration, appointments, consultations, billing and day-to-day operations in one organised system.",
  },
  challenges: [
    {
      title: "Appointment books that overflow",
      description:
        "Bookings are taken by phone and paper diaries, leading to double bookings and long waiting times.",
    },
    {
      title: "Patient information spread across files",
      description:
        "Registration details and visit history are stored in different registers and folders.",
    },
    {
      title: "Billing reconciled at the end of the day",
      description:
        "Fees, packages and payments are totalled by hand, which makes errors hard to find.",
    },
    {
      title: "Little insight into operations",
      description: "Owners cannot easily see patient volumes, doctor schedules or revenue trends.",
    },
  ],
  workflows: [
    {
      name: "Patients",
      description: "Register patients and keep their visit history in one place.",
    },
    {
      name: "Appointments",
      description: "Schedule and confirm appointments for each doctor or service.",
    },
    { name: "Consultations", description: "Record consultation details and follow-up dates." },
    { name: "Billing", description: "Generate invoices and record payments for each visit." },
    { name: "Business operations", description: "Monitor schedules, patient volumes and revenue." },
  ],
  solutions: ["custom-software", "crm", "automation", "website-development"],
  features: [
    {
      title: "Appointment scheduling",
      description: "Doctor and service calendars with confirmation reminders.",
    },
    {
      title: "Patient registration",
      description: "Quick registration with a single record for each patient.",
    },
    {
      title: "Visit billing",
      description: "Consistent fees and invoices generated at checkout.",
    },
    {
      title: "Operations dashboard",
      description: "Daily patient flow, schedules and collections at a glance.",
    },
  ],
  benefits: [
    {
      title: "Shorter waiting times",
      description: "Organized scheduling reduces overbooking and idle gaps.",
    },
    {
      title: "Organized records",
      description: "Staff find patient information quickly instead of searching registers.",
    },
    {
      title: "Accurate daily collections",
      description: "Billing and payments reconcile automatically at the end of each day.",
    },
  ],
  projects: [],
  seo: {
    title: "Clinic and Healthcare Management Software",
    description:
      "Healthcare business software for patient registration, appointments, consultations, billing and daily operations in clinics and healthcare centres.",
  },
};
