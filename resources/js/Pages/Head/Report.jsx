import SidebarLayout from "@/Layouts/SidebarLayout"

export default function(){
    return(
        <SidebarLayout>
            <div className="flex-col flex overflow-auto">
                <h3 className="font-bold text-lg m-4">Report</h3>
                <div className="flex justify-center items-center">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Report Page</h2>
                            <p>This is the report page for the head role.</p>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    )
}   