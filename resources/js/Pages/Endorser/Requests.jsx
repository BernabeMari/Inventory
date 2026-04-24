import SearchField from "@/Components/SearchField";
import { useState } from "react";

export default function({requests}){
    const [search, setSearch] = useState('')
    return(
         <div className="flex-col flex overflow-auto">
        
                {/* Search button */}
                      <div className="p-4">
                
                        <SearchField
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search items..."
                        />
                
                        <p className="mt-4">
                          You searched: {search}
                        </p>
                
                      </div>
        
        
                {/* Table */}
                <div className="flex justify-center items-center">
                    <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                        <th>REQUEST NO.</th>
                        <th>DEPARTMENT</th>
                        <th>REQUEST</th>
                        <th>QUANTITY OF REQUEST</th>
                        <th>STATUS</th>
                        <th>MESSAGE</th>
                        <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(request => (
                        <tr> 
        
        
                        <td>
                            <div className="font-bold">
                                {request.id}
                            </div>
                        </td>
        
        
                        <td>
                            <div className="font-bold">
                             
                            </div>
                        </td>
        
        
                        <td>
                            <div className="font-bold">
                           
                            </div>
                        </td>
        
        
                        <td>
                            <div className="font-bold">
                               {/* beginning of measure */}
                            </div>
                        </td>
        
                        </tr>
                     ))}
                    </tbody>
                    </table>
                </div>
            </div>
    )
}