import ResourceDetailView from "./ResourceDetailView";

export function generateStaticParams() {
  return [
    { id: "res-vm-01" },
    { id: "res-vm-02" },
    { id: "res-vm-03" },
    { id: "res-vm-04" },
    { id: "s3-customer-vault-prod" },
    { id: "s3-finance-ledger-backup" },
    { id: "rds-postgres-primary" },
    { id: "cosmos-db-sessions" },
    { id: "api-gateway-public" },
    { id: "iam-prod-deployer" },
  ];
}

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  return <ResourceDetailView id={params.id} />;
}
