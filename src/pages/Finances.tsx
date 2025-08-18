export default function Finances() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Finances</h1>
      </div>
      <div className="bg-card rounded-2xl p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Finances Coming Soon</h2>
        <p className="text-muted-foreground">
          Manage payments and financial documents.
        </p>
      </div>
    </div>
  );
}