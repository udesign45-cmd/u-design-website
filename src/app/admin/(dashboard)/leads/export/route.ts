import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
import * as XLSX from "xlsx";
import { listLeadsForExport, type LeadsSort } from "@/lib/leads/queries";
import type { LeadRow, LeadStatus, PlanTier } from "@/lib/supabase/types";
import { STATUS_META } from "@/components/admin/ui/StatusBadge";

const SORT_FIELDS: LeadsSort[] = ["created_at", "name", "company", "status"];
const PLAN_LABEL: Record<string, string> = { basic: "Basic", standard: "Standard", premium: "Premium" };

const COLUMNS = [
  "Name",
  "Email",
  "Phone",
  "Company",
  "Service",
  "Plan",
  "Budget",
  "Message",
  "Status",
  "Date",
  "Source",
] as const;

function toRow(lead: LeadRow): string[] {
  return [
    lead.name,
    lead.email,
    lead.phone,
    lead.company,
    lead.service_label ?? "",
    lead.plan ? (PLAN_LABEL[lead.plan] ?? lead.plan) : "",
    lead.budget_label ?? "",
    lead.message ?? "",
    STATUS_META[lead.status].label,
    new Date(lead.submitted_at).toISOString(),
    lead.source_page,
  ];
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function buildCsv(rows: LeadRow[]): string {
  const lines = [COLUMNS.join(","), ...rows.map((r) => toRow(r).map(csvEscape).join(","))];
  return `﻿${lines.join("\r\n")}`;
}

function buildXlsx(rows: LeadRow[]): Buffer {
  const sheetData = [COLUMNS as unknown as string[], ...rows.map(toRow)];
  const sheet = XLSX.utils.aoa_to_sheet(sheetData);
  sheet["!cols"] = [
    { wch: 20 },
    { wch: 26 },
    { wch: 16 },
    { wch: 22 },
    { wch: 22 },
    { wch: 10 },
    { wch: 16 },
    { wch: 40 },
    { wch: 12 },
    { wch: 22 },
    { wch: 16 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Leads");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

/** Exports the current filtered/sorted view (RLS: authenticated only, enforced by middleware). */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const format = params.get("format") === "xlsx" ? "xlsx" : "csv";
  const status = (params.get("status")?.split(",").filter(Boolean) ?? []) as LeadStatus[];
  const service = params.get("service") ? [params.get("service")!] : undefined;
  const plan = params.get("plan") ? ([params.get("plan")!] as PlanTier[]) : undefined;
  const sortParam = params.get("sort");
  const sort = SORT_FIELDS.includes(sortParam as LeadsSort) ? (sortParam as LeadsSort) : "created_at";
  const dir = params.get("dir") === "asc" ? "asc" : "desc";

  const rows = await listLeadsForExport({
    q: params.get("q") ?? undefined,
    status,
    service,
    plan,
    sort,
    dir,
  });

  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "xlsx") {
    const buffer = buildXlsx(rows);
    return new NextResponse(new Blob([Uint8Array.from(buffer)]), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="u-design-leads-${stamp}.xlsx"`,
      },
    });
  }

  return new NextResponse(buildCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="u-design-leads-${stamp}.csv"`,
    },
  });
}
