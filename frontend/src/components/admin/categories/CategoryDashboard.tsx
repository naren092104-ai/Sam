import React from "react";

export function CategoryDashboard({ categories, total }: { categories: any[]; total: number }) {
  const active = categories.filter((c) => c.status === "active").length;
  const hidden = categories.filter((c) => c.status === "hidden").length;
  const productsAssigned = categories.reduce((sum, c) => sum + (c.productsCount || 0), 0);

  const cards = [
    { label: "Total Categories", value: total },
    { label: "Active Categories", value: active },
    { label: "Hidden Categories", value: hidden },
    { label: "Products Assigned", value: productsAssigned },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl bg-white p-4 shadow-sm border" style={{ borderColor: "#FED7AA" }}>
          <p className="text-sm font-semibold text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
