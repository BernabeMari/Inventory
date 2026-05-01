import SearchField from "@/Components/SearchField"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import { PlusIcon, PencilSquareIcon, TrashIcon  } from "@heroicons/react/24/solid";
import SidebarLayout from "@/Layouts/SidebarLayout";

export default function({users}){
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [createUserModal, setcreateUserModal] = useState(false)
  const [search, setSearch] = useState("")
  

  const {post, data, setData, reset} = useForm({
    username: '',
    password: '',
    role: '',
    department: '',
    image: '',
    role_department: '',
    username_edit: '',
    is_active: true
  })

  function createUser(e){
    e.preventDefault()
    post(route('create_user'), {
      onSuccess: () => {setcreateUserModal(false); reset()}
    })
  }

  function editUser(e){
    e.preventDefault()
    post(route('edit_user'),{
      onSuccess: () => {setEditModal(false); reset()}
    })
  }

  function deleteUser(e){
    e.preventDefault()
    post(route('delete_user'),{
      onSuccess: ()=> {setDeleteModal(false); reset(); page.reload()}
    })

  }

  function restoreUser(e){
    e.preventDefault()
    post(route('restore_user'),{
      onSuccess: ()=> {setEditModal(false); reset(); page.reload()}
    })
  }

  return(
    <SidebarLayout>
    <div className="flex-col flex overflow-auto">
    <h3 className="font-bold text-lg m-4">Create Item</h3>
      {/* Search button */}
      <div className="p-4 flex flex-row gap-4 ">

        <div>
            <SearchField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
          />

          <p className="mt-4">
            You searched: {search}
          </p>
        </div>

        {/* Toggle switch active/inactive users */}
        <div className="absolute right-20">
          <label className="toggle text-base-content">
          <input type="checkbox" checked={!data.is_active} onChange={(e) => setData('is_active', !e.target.checked)} />
          <svg aria-label="enabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="4"
              fill="none"
              stroke="currentColor"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </g>
          </svg>
          <svg
            aria-label="disabled"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </label>
        </div>
      </div>

      {data.is_active ? (
        <p className="text-sm text-gray-500 m-4">Showing active users</p>
      ) : (
        <p className="text-sm text-gray-500 m-4">Showing inactive users</p>
      )}
      {/* Table */}
      <div className="flex justify-center items-center">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>

            {users.filter(user => Boolean(user.is_active) === data.is_active).filter(user => user.username.toLowerCase().includes(search.toLowerCase()) || user.role.toLowerCase().includes(search.toLowerCase()) || user.department && user.department.toLowerCase().includes(search.toLowerCase())).map(user => (
              <tr>
              
              
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask rounded-full h-10 w-10 flex items-center justify-cente">
                      {user.image ? (
                      <img src={`/storage/${user.image}`} alt={user.username} />
                    ) : (
                      <div className="bg-red-300 w-10 h-10 flex items-center justify-center rounded-full">
                        {user.username?.toUpperCase().slice(0, 1)}
                      </div>
                    )}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{user.username}</div>
                  </div>
                </div>
              </td>
              <td>
                {user.role}
              </td>
              <td>{user.department}</td>


              <th>
                <button onClick={(e) => {setEditModal(true);setData({username: user.username, user_id: user.id, username_edit: user.username, is_active: data.is_active })}} className="btn btn-dash btn-primary"><PencilSquareIcon className="w-5 h-5"/></button>
                {data.is_active && (
                  <button onClick={(e) => {setDeleteModal(true); setData({user_id: user.id, username: user.username, is_active: data.is_active})}} className="btn btn-dash btn-error"><TrashIcon className="w-5 h-5"/></button>
                )}
              </th>
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Button */}
      <div className="bg-white m-6 bottom-0 right-0 absolute rounded-full border border-black ">
        <button onClick={(e) => setcreateUserModal(true)} className="btn btn-soft btn-secondary rounded-full p-4"><PlusIcon className="w-5 h-5" /></button>
      </div>
      
      
      {/* Edit Modal */}
      {editModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            {data.is_active === false && (
              <button
              className="btn btn-sm btn-circle mr-20 btn-ghost absolute right-2 top-2"
              onClick={restoreUser}
            >
              Restore
            </button>
            )}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setEditModal(false)}
            >
              ✕
            </button>
          
            <form onSubmit={editUser} className="flex flex-col justify-center items-center gap-2">

              <h3 className="font-bold text-lg m-4">Edit User {data.username_edit}</h3>
            
              {/* username Input */}
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>

                  <input value={data.username} onChange={(e) => setData('username', e.target.value)} type="text" placeholder="Username" pattern="[A-Za-z][A-Za-z0-9\-]*" minLength="3" maxLength="30" title="Only letters, numbers or dash"/>
              
              </label>
                  <p className="validator-hint">
                    Must be 3 to 30 characters
                    <br />containing only letters, numbers or dash
                  </p>


                {/* Password */}
                <label className="input validator">
                  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <path
                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                      ></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
  
                  <input value={data.password} onChange={(e) => setData('password', e.target.value)} type="text" placeholder="Password" minLength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
              </label>
              <p className="validator-hint hidden">
                Must be more than 8 characters, including
                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
              </p>


              {/* Select Role */}
              <select value={data.role} onChange={(e) => setData('role', e.target.value)} className="select mt-5">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="receiver">Receiver</option>
                <option value="endorser">Endorser</option>
                <option value="head">Head</option>
                <option value="department">Department</option>
              </select>


            {/* if user is department */}
            {data.role === 'department' && (
              <div>
                <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>

                  <input required value={data.role_department} onChange={(e) => setData('role_department', e.target.value)} type="text" placeholder="Role" maxLength="30" title="Department"/>
              </label>
              </div>
            )}


            {/* Submit Button */}
            <button className="btn btn-primary">Edit User</button>
          </form>

          
          </div>
        </dialog>
      )}

      
      {/* Delete User(soft delete) */}
      {deleteModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setDeleteModal(false)}
            >
              ✕
            </button>
            <p>Are you sure you want to DELETE this user? ({data.username})</p>
            <div className="flex flex-row justify-center">
              <button onClick={(e) => deleteUser(e, data.user_id)} className="btn btn-success w-10">Yes</button>
              <button onClick={() => setDeleteModal(false)} className="btn btn-error w-10">No</button>
            </div>
          </div>
        </dialog>
      )}


      {/* Create User */}
      {createUserModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setcreateUserModal(false)}
            >
              ✕
            </button>

            <form onSubmit={createUser} className="flex flex-col justify-center items-center gap-2">

              <h3 className="font-bold text-lg m-4">Create User</h3>
            
              {/* username Input */}
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>

                  <input value={data.username} onChange={(e) => setData('username', e.target.value)} type="text" required placeholder="Username" pattern="[A-Za-z][A-Za-z0-9\-]*" minLength="3" maxLength="30" title="Only letters, numbers or dash"/>
              
              </label>  
                  <p className="validator-hint">
                    Must be 3 to 30 characters
                    <br />containing only letters, numbers or dash
                  </p>


                {/* Password */}
                <label className="input validator">
                  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <path
                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                      ></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
  
                  <input value={data.password} onChange={(e) => setData('password', e.target.value)} type="text" required placeholder="Password" minLength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
              </label>
              <p className="validator-hint hidden">
                Must be more than 8 characters, including
                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
              </p>


              {/* Select Role */}
              <select required value={data.role} onChange={(e) => setData('role', e.target.value)} className="select mt-5">
                <option value="" disabled>Select Role</option>
                <option value="admin">Admin</option>
                <option value="receiver">Receiver</option>
                <option value="endorser">Endorser</option>
                <option value="head">Head</option>
                <option value="department">Department</option>
              </select>
              <p className="validator-hint hidden">
                Role is required
              </p>


            {/* if user is department */}
            {data.role === 'department' && (
              <div>
                <label className="input validator">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
              </svg>

                  <input value={data.role_department} onChange={(e) => setData('role_department', e.target.value)} type="text" required placeholder="Department" maxLength="30" title="Department"/>
              </label>
              </div>
            )}


            {/* Submit Button */}
            <button className="btn btn-primary">Create User</button>
          </form>

          
          </div>
        </dialog>
      )}


    </div>
    </SidebarLayout>
  )
}