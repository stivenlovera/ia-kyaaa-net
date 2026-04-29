import { TabAuth } from "../../components/Auth/tab-auth";

export default async function Page() {
    return (
        <div className="w-screen h-screen flex items-center justify-center -mt-27">
            <div className="login-form pt-40 pb-2 px-2 bg-amber-50">
                <TabAuth></TabAuth>
            </div>
        </div>
    )
}
