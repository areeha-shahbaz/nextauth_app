export type UserType ={
    id: string;
    name:string;
    email: string;
    hasPaid: boolean;
    role: string;
}
export async function getUser(): Promise<UserType | null>{
    try {
        const token = localStorage.getItem("token");
       if(!token) return null;
       const res = await fetch("/api/users/profile",{
        headers: {Authorization: `Bearer ${token}`},
       });
       if(!res.ok) return null;
       const data = await res.json();
       return data.user as UserType;
    }
    catch(err){
        console.log("data error");
        console.error("getUser error:", err);
        return null;
    }
}
