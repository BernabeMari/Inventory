import SidebarLayout from "@/Layouts/SidebarLayout";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Dashboard({ statusChartData = {}, quantityChartData = {} }) {

    const statusData = Object.entries(statusChartData).map(([name, value]) => ({
        name,
        value,
    }));

    const quantityData = Object.entries(quantityChartData).map(([name, value]) => ({
        name,
        value,
    }));

    const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];

    return (
        <SidebarLayout>
           <div className="flex-col flex overflow-auto">
            <h3 className="font-bold text-lg m-4">Requests</h3> 
                <div className="grid gap-6 lg:grid-cols-2 max-w-4xl mx-auto">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Accepted vs Rejected</h2>
                            <PieChart width={350} height={300}>
                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Fulfilled vs Unfulfilled</h2>
                            <PieChart width={350} height={300}>
                                <Pie
                                    data={quantityData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label
                                >
                                    {quantityData.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[(index + 1) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </div>
                    </div>
                </div>
              </div>
        </SidebarLayout>        
    );
}