import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";
interface JwtPayload{
    id: string;
    email: string;
    role:string;
}
export async function middleware(req:NextRequest){
  const {pathname} = req.nextUrl;

if(pathname.startsWith("/admin")){
     try{
        const authHeader =req.headers.get("authorization");
        const token= authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        :null;
        if(!token){
            return NextResponse.redirect(new URL("/non-auth/login",req.url));
        }
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;
        if(decoded.role !== "admin"){
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
        return NextResponse.next();
     }catch(error){
        console.error("Middleware authorization error", error);
        return NextResponse.redirect(new URL("/login", req.url));
     }
    }
    return NextResponse.next();
}
export const config = {
  matcher: ["/admin/:path*"],
};
