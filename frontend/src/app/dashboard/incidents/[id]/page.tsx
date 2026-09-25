import IncidentDetailView from "./IncidentDetailView";

export function generateStaticParams() {
  return [
    { id: "INC-2026-001" },
    { id: "INC-2026-002" },
    { id: "INC-2026-003" },
    { id: "INC-2026-004" },
    { id: "INC-2026-005" },
    { id: "INC-2026-006" },
    { id: "INC-2026-091" },
  ];
}

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  return <IncidentDetailView id={params.id} />;
}
