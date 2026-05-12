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
        <h3 className="font-bold text-3xl m-4 bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent">Profile</h3>
            <div className="flex justify-center items-center p-4">

            <div className="bg-white/85 border-2 border-[#e4c57c]/70 rounded-xl p-6 w-96 shadow-lg">

            <figure className="mb-4 rounded-lg overflow-hidden">
                {profile.filter(profile => profile.id === auth.user.id).map(profile => (
                    <img src={`/storage/${profile.image}`} alt={`${auth.user.username.toUpperCase()} has no photo yet`} className="w-full h-auto" />
                ))}
            </figure>
            
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] bg-clip-text text-transparent">Edit Your Profile</h2>
                <p className="text-gray-600">This page is where you upload your department's image.</p>
                <div className="flex flex-col gap-4">
                    <form onSubmit={setProfile} className="flex flex-col gap-4">
                    <div>
                    <label className="block text-sm font-semibold text-[#4a2814] mb-2">Choose Profile Image</label>
                    <input type="file" onChange={(e)=> setData('image', e.target.files[0])} className="w-full px-3 py-2 border border-[#d8b36b] rounded bg-white text-[#2d1208] file:bg-gradient-to-r file:from-[#8b1c1c] file:via-[#b91c1c] file:to-[#d4a017] file:text-white file:border-none file:rounded file:px-3 file:py-2 file:cursor-pointer" />
                    </div>
                    <label className="text-xs text-gray-500">Max size 2MB</label>
                     <button type="submit" className="bg-gradient-to-r from-[#8b1c1c] via-[#b91c1c] to-[#d4a017] hover:shadow-lg text-white font-semibold py-2 rounded-lg transition">Upload</button>
                    </form>
                </div>
            </div>

            </div>
            </div>
        </div>
        </SidebarLayout>
    )
}