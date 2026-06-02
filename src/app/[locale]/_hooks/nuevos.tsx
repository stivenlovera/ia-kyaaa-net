import { useEffect, useState } from "react";
import { IResponse } from "../../types/response";
import { IAuthUser } from "../../types/user.type";

export function usePack() {
    const [packs, setPack] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //getNewPosts();
    }, []);

    const getNewPosts = async () => {
        try {
            const response = await fetch('/api/auth/protected');
            const data: IResponse<IAuthUser> = await response.json();
            if (data.success) {
                setPack(data.data.user);
            } else {
                setPack(null);
                //signOut()
            }
        } catch (error) {
            console.log('catch', error)
            setPack(null);
        } finally {
            //console.log('finally')
            setLoading(false);
        }
    };

    return { packs, loading, getNewPosts };
}