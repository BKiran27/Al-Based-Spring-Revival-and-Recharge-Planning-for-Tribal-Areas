import UserDetailView from "./UserDetailView";

export function generateStaticParams() {
  return [
    { id: "usr-admin-demo" },
    { id: "usr-analyst-demo" },
    { id: "usr-operator-demo" },
    { id: "usr-viewer-demo" },
    { id: "usr-alex-chen" },
    { id: "usr-sarah-jenkins" },
    { id: "usr-david-ross" },
    { id: "usr-wei-zhang" },
    { id: "usr-carlos-mendez" },
    { id: "usr-aisha-mansoor" },
  ];
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return <UserDetailView id={params.id} />;
}
