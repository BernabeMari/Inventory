export default function(){
    return(
        <div className="flex bg-slate-800 min-h-screen justify-center items-center">
            <div className="bg-white w-80 rounded-xl">
                <p className="m-4 text-center">Login</p>
                <form className="flex-col flex">
                    <input className="m-2 rounded-2xl" type="text" placeholder="Enter Username" />
                    <input className="m-2 rounded-2xl" type="password" placeholder="Enter Username" />
                    <button type="submit" className="bg-slate-400 m-4 p-2 rounded-2xl">Login</button>
                </form>
            </div>
        </div>
    )
}