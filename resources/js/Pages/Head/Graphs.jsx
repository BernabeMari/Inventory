import SidebarLayout from "@/Layouts/SidebarLayout";
import { router, useForm } from "@inertiajs/react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Dashboard({ statusChartData = {}, quantityChartData = {}, departmentChartData = [], itemsChartData = [] }) {
    const {post, setData, data} = useForm({
        start_date: '',
        end_date: ''
    })
    const statusData = Object.entries(statusChartData).map(([name, value]) => ({
        name,
        value,
    }));

    const quantityData = Object.entries(quantityChartData).map(([name, value]) => ({
        name,
        value,
    }));

    const itemsData = Array.isArray(itemsChartData) ? itemsChartData : [];

    const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];

    function handleFilter(e){
        e.preventDefault()
        router.get(route('head_page'),{
            start_date: data.start_date,
            end_date: data.end_date,
        })
    }
    return (
        <SidebarLayout>
           <div className="flex-col flex overflow-auto">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#b91c1c]">Head</p>
            <h3 className="font-bold text-3xl m-4 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent">Graphs</h3> 
                <div className="flex justify-end mb-5">
                    <form onSubmit={handleFilter}>
                        <input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)}/> - <input type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)}/>                    
                        <button type="submit" className="btn btn-primary ml-4">Filter Report</button>
                    </form> 
                </div>
                <div className="flex overflow-auto flex-row gap-10 justify-center">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Pending / Accepted / Rejected / Cancelled</h2>
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
                            <h2 className="card-title">Fulfilled / Unfulfilled</h2>
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
                
                <div className="card mt-10 bg-base-100 shadow max-w-4xl mx-auto w-full">
                    <div className="card-body">
                        <h2 className="card-title">Department Request Items</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentChartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis allowDecimals={false}/>
                                <Tooltip />
                                <Bar dataKey="requests" fill="#60a5fa" name="Number of Request Items" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card mt-10 bg-base-100 shadow max-w-4xl mx-auto w-full">
                    <div className="card-body">
                        <h2 className="card-title">Items Inventory Balance</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={itemsData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#34d399" name="Items" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
              </div>
        </SidebarLayout>        
    );
}