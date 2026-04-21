import SearchField from "@/Components/SearchField"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import { PlusIcon, PencilSquareIcon, TrashIcon  } from "@heroicons/react/24/solid";

export default function({users}){
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [createUserModal, setcreateUserModal] = useState(false)
  const [search, setSearch] = useState(" ")

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
      onSuccess: ()=> setDeleteModal(false)
    })

  }
  return(
    <div className="flex-col flex overflow-auto">

      {/* Search button */}
      <div className="p-4">

        <SearchField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
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
              <th>Username</th>
              <th>Role</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {users.filter(users => users.is_active).map(users => (
              <tr>
              
              
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                        alt="Avatar Tailwind CSS Component" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{users.username}</div>
                  </div>
                </div>
              </td>
              <td>
                {users.role}
              </td>
              <td>{users.department}</td>


              <th>
                <button onClick={(e) => {setEditModal(true);setData({username: users.username, user_id: users.id, username_edit: users.username})}} className="btn btn-dash btn-primary"><PencilSquareIcon className="w-5 h-5"/></button>
                <button onClick={(e) => {setDeleteModal(true);setData({user_id: users.id, username: users.username})}} className="btn btn-dash btn-error"><TrashIcon className="w-5 h-5"/></button>
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
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>

                  <input value={data.role_department} onChange={(e) => setData('role_department', e.target.value)} type="text" placeholder="Role" maxLength="30" title="Department"/>
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
              <button onClick={(e) => {setData({user_id: data.user_id});deleteUser(e)}} className="btn btn-success w-10">Yes</button>
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
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>

                  <input value={data.role_department} onChange={(e) => setData('role_department', e.target.value)} type="text" required placeholder="Role" maxLength="30" title="Department"/>
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
  )
}