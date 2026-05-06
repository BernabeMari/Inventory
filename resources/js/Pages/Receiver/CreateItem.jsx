import SearchField from "@/Components/SearchField";
import SidebarLayout from "@/Layouts/SidebarLayout";
import { PlusIcon, PencilSquareIcon, TrashIcon  } from "@heroicons/react/24/solid";
import { router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";

export default function(){
    const [search, setSearch] = useState('')
    const [resetModal, setResetModal] = useState(false)
    const [createItemModal, setcreateItemModal] = useState(false)
    const [editItemModal, seteditItemModal] = useState(null)
    const [addReceiptModal, setaddReceiptModal] = useState(null)
    const {unitofmeasure, items, flash, quantities, issuances, history} = usePage().props
    const {post, data, setData, reset} = useForm({
        unit_of_measure: '',
        description: '',
        total: '',
        quantity: '',
    })

    const [unitOptions, setUnitOptions] = useState(
        unitofmeasure.map(item => ({
            value: item.id,
            label: item.unit_of_measure
        }))
    )
        
    function createItem(e){
        e.preventDefault()
        post(route('create_item'),{
            onSuccess: ()=> {setcreateItemModal(false); reset()}
        })
    }

    function addReceipt(e){
        e.preventDefault()
        post(route('add_receipt'),{
            onSuccess: () => {setaddReceiptModal(false); reset()}
        })
    }

    function editReceipt(e){
        e.preventDefault()
        post(route('edit_receipt'),{
            onSuccess: () => {seteditItemModal(false); reset()}
        })
    }

    function handleSearch(e){
        setSearch(e.target.value)
        router.get(route('receiver_page'), {search: e.target.value})
    }

    function resetInventory(e){
        e.preventDefault()  
        post(route('reset_inventory'), {less: 0, add_receipts: [], onSuccess: () => setResetModal(false)})
    }

    return(
    <SidebarLayout>
    <div className="flex-col flex overflow-auto relative">
        <h3 className="font-bold text-lg m-4">Create Item</h3>
        {flash.success && (
            <div className="alert alert-success mb-4">
                {flash.success}
            </div>
        )}
        {flash.error && (
            <div className="alert alert-error mb-4">
                {flash.error}
            </div>
        )}
        {/* Search button */}
              <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
        
                <div>
                    <SearchField value={search} onChange={handleSearch} placeholder="Search items..."/>
        
                    <p className="mt-4">
                    You searched: {search}
                    </p>
                </div>

                {/* Add Item Button */}
                <div className="bg-white m-6 rounded-full border border-black ">
                    <button onClick={(e) => setcreateItemModal(true)} className="btn btn-soft btn-secondary rounded-full p-4"><PlusIcon className="w-5 h-5" />Create Item</button>
                </div>
              </div>

              {/* reset button */}
                <div className="absolute top-0 right-0">
                    <button onClick={(e) => {setResetModal(true); setData({id: data.id})}} className="btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    </button>
                </div>
                

                {/* reset Modal */}
            {resetModal && (
                <dialog className="modal modal-open">
                <div className="modal-box">
                    <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setResetModal(false)}
                    >
                    ✕
                    </button>

                    <form onSubmit={resetInventory} className="flex flex-col gap-4">
                        <p>Are you sure you want to <p className="badge badge-ghost bold badge-xl">RESET</p> this month with:</p>                 
                        <div className="flex justify-center items-center">
                        <div className="overflow-x-auto w-full max-h-[400px] overflow-y-auto">
                            
                            <table className="table table-zebra text-sm">
                            
                            <thead className="sticky top-0 bg-base-100 z-10">
                                <tr>
                                <th>ITEM NO.</th>
                                <th>DESCRIPTION</th>
                                <th>UNIT</th>
                                <th>BEGINNING</th>
                                <th>ADD: RECEIPTS</th>
                                <th>TOTAL</th>
                                <th>LESS: ISSUANCE</th>
                                <th>ENDING</th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map(item => {
                                    const lastHistory = item.history[item.history.length - 1];
                                    return (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.description}</td>
                                            <td>{item.unit_of_measure}</td>
                                            <td>{lastHistory?.ending_balance}</td>
                                            <td>{item.added_receipt?.join(' + ')}</td>
                                            <td>{item.total}</td>
                                            <td>{item.less}</td>
                                            <td className="font-bold text-primary">
                                                {item.total - item.less}
                                            </td>
                                        </tr>
                                    );
                                })}

                            </tbody>

                            </table>

                        </div>
                        </div>

                                <div className="flex flex-row gap-10 justify-center">
                                    <button type="submit" className="btn btn-success w-10">Yes</button>
                                    <button onClick={() => setResetModal(false)} className="btn btn-error w-10">No</button>
                                </div>
                    </form>
                
                </div>
                </dialog>
            )}


        {/* Table */}
        <div className="flex justify-center items-center">
            <table className="table">
            {/* head */}
            <thead>
                <tr>
                <th>ITEM NO.</th>
                <th>DESCRIPTION</th>
                <th>UNIT OF MEASURE</th>
                <th>ADD:RECEIPTS</th>
                <th>TOTAL</th>
                <th>LESS: ISSUANCE</th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                <tr> 


                <td>
                    <div className="font-bold">
                        {item.id}
                    </div>
                </td>


                <td>
                    <div className="font-bold">
                        {item.description}
                    </div>
                </td>


                <td>
                    <div className="font-bold">
                        {item.unit_of_measure}
                    </div>
                </td>
                
                <td>
                     <div className="flex justify-between items-center">
                        {item.added_receipt?.join(' + ')}
                        
                        {addReceiptModal === item.id && (<div>
                            <form onSubmit={addReceipt}>
                                <input value={data.quantity} min="1" onChange={(e) => setData('quantity', e.target.value)} placeholder="Add Receipt" type="number" required/>
                                <button type="submit"></button>
                            </form>
                        </div>)}
                        
                        <div>
                            <button onClick={() => {setaddReceiptModal(item.id); setData({item_id: item.id})}} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></button>
                            <button onClick={() => {seteditItemModal(item.id); setData({item_id: item.id, quantity: item.quantities.map(q => ({id: q.id, quantity: q.quantity, quantity_id: q.id}))})}} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg></button>
                        </div>
                        
                        {/* Edit Receipt Modal */}
                        {editItemModal && (
                                <dialog className="modal modal-open">
                                    <div className="modal-box">
                                        {data.quantity_id}
                                        <h3 className="font-bold text-lg m-4">Edit Receipt</h3>
                                        <button
                                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                            onClick={() => seteditItemModal(false)}
                                        >
                                            ✕
                                        </button>

                                        <form onSubmit={editReceipt} className="flex flex-col gap-4">
                                            {data.quantity?.map((qty, index) => (
                                            <div key={index} className="flex items-center justify-center gap-2 mb-4">
                                                <input
                                                type="number"
                                                min="1"
                                                required
                                                value={qty.quantity}
                                                onChange={(e) => {
                                                    const newQuantity = [...data.quantity];
                                                    newQuantity[index] = {
                                                    ...newQuantity[index],
                                                    quantity: e.target.value
                                                    };
                                                    setData('quantity', newQuantity);
                                                }}
                                                />
                                            </div>
                                            ))}
                                            <button type="submit" className="btn btn-primary">Save Edit</button>
                                        </form>
                                     </div>
                                </dialog>
                            )}

                    </div>
                </td>

                <td>
                    <div className="font-bold">
                       {item.total}
                    </div>
                </td>
                
                
                <td>
                    <div className="font-bold">
                       {item.less}
                    </div>
                </td>

                </tr>
                ))}
            </tbody>
            </table>
        </div>

    {/* Create Item */}
      {createItemModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setcreateItemModal(false)}
            >
              ✕
            </button>

            <form onSubmit={createItem} className="flex flex-col gap-4">
                <h3 className="font-bold text-lg m-4">Create Item</h3>

                <div className="flex flex-row gap-4">
                    <label className="input validator">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
                    </svg>
                    <input value={data.description} onChange={(e) => setData('description', e.target.value)} type="text" required placeholder="Item" title="Create Items Here"/>
                    </label> 
                
                
                    <label className="input validator">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                    </svg>
                    <input value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} min={0} type="number" required placeholder="Quantity" title="Input Quantity of Item Here"/>
                    </label> 
                </div>

                <div className="flex justify-center">
                    <label className="input validator">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
                    </svg>
                    <CreatableSelect className="w-full"
                        maxMenuHeight={200}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        value={unitOptions.find(u => u.label === data.unit_of_measure) || null}
                        onChange={(selected) => setData('unit_of_measure', selected ? selected.label : '')}
                        onCreateOption={(inputValue) => {
                            const newOption = { value: inputValue, label: inputValue };
                            setUnitOptions(prev => [...prev, newOption]);
                            setData('unit_of_measure', inputValue);
                        }}
                        required
                        options={unitOptions}
                        isSearchable
                    />        
                    </label> 
                </div>
               
               {/* Create Item Button */}
                <button className="btn btn-primary">Create Item</button>
            </form>
          
          </div>
        </dialog>
      )}


    </div>
    </SidebarLayout>
    )
}