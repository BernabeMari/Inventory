import SidebarLayout from "@/Layouts/SidebarLayout";
import { useForm, usePage } from "@inertiajs/react"

export default function({profile}){
    const {auth} = usePage().props;
    const {post, data, setData} = useForm({
        image: ''
    })

    function setProfile(e){
        e.preventDefault()
        post(route('profile_picture'))
    }
    return(
        <SidebarLayout>
        <div className="flex-col flex overflow-auto">
        <h3 className="font-bold text-lg m-4">Profile</h3>
            <div className="flex justify-center items-center">

            <div className="card bg-base-100 w-96 shadow-sm">

            <figure>
                {profile.filter(profile => profile.id === auth.user.id).map(profile => (
                    <img src={`/storage/${profile.image}`} alt={`${auth.user.username.toUpperCase()} has no photo yet`} />
                ))}
            </figure>
            
            <div className="card-body">
                <h2 className="card-title">Edit Your Profile</h2>
                <p>This page is where you upload your department’s image.</p>
                <div className="card-actions flex flex-col">
                    <form onSubmit={setProfile} className="fieldset">
                    <input type="file" onChange={(e)=> setData('image', e.target.files[0])} className="file-input" />
                    <label className="label">Max size 2MB</label>
                     <button type="submit" className="btn btn-primary">Upload</button>
                    </form>
                </div>
            </div>

            </div>
            </div>
        </div>
        </SidebarLayout>
    )
}