import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin and analyzer routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/analyze")) {
    try {
      const authHeader = req.headers.get("authorization");
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      if (!token) {
        return NextResponse.redirect(new URL("/non-auth/login", req.url));
      }

      // Verify JWT (only uses secret, no DB)
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JwtPayload;

      // Admin only route
      if (pathname.startsWith("/admin") && decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // Analyzer route: ✅ just allow, DB check will be inside route/page
      if (pathname.startsWith("/analyze")) {
        // Middleware only ensures login.
        // Actual "hasPaid" check happens in API route / server component.
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Middleware authorization error", error);
      return NextResponse.redirect(new URL("/non-auth/login", req.url));
    }
  }

  return NextResponse.next();
}

// Restrict only these paths
export const config = {
  matcher: ["/admin/:path*", "/analyze/:path*"],
};
// import {NextRequest, NextResponse} from "next/server";
// import jwt from "jsonwebtoken";

// import User from "src/models/userModel";
// import connect from "src/dbConnection/dbConnection";
// interface JwtPayload{
//     id: string;
//     email: string;
//     role:string;
//  }
//  export async function middleware(req: NextRequest) {
//   await connect();
//   const { pathname } = req.nextUrl;

//   if (pathname.startsWith("/admin") || pathname.startsWith("/analyze")) {
//     try {
//       const authHeader = req.headers.get("authorization");
//       const token = authHeader?.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : null;

//       if (!token) {
//         return NextResponse.redirect(new URL("/non-auth/login", req.url));
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
//       if (pathname.startsWith("/admin") && decoded.role !== "admin") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }

//       if (pathname.startsWith("/analyze")) {
//         const user = await User.findOne({ email: decoded.email });
//         if (!user || !user.hasPaid) {
//           return NextResponse.redirect(new URL("/payment", req.url));
//         }
//       }

//       return NextResponse.next();

//     } catch (error) {
//       console.error("Middleware authorization error", error);
//       return NextResponse.redirect(new URL("/non-auth/login", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export async function middleware(req:NextRequest){
// await connect();
//   const {pathname} = req.nextUrl;

// if(pathname.startsWith("/admin")){
//      try{
//         const authHeader =req.headers.get("authorization");
//         const token= authHeader?.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         :null;
//         if(!token){
//             return NextResponse.redirect(new URL("/non-auth/login",req.url));
//         }
//         const decoded = jwt.verify(
//             token,
//             process.env.JWT_SECRET!
//         ) as JwtPayload;
//         if(decoded.role !== "admin"){
//             return NextResponse.redirect(new URL("/unauthorized", req.url));
//         }
//         return NextResponse.next();
    
//     if(pathname.startsWith("/analyze")) {
//       const user = await User.findOne({ email: decoded.email });
//       if (!user || !user.hasPaid) {
//         return NextResponse.redirect(new URL("/payment", req.url));
//       }
//       return NextResponse.next();
//     }

//     return NextResponse.next();
//   }

//         catch(error){
//         console.error("Middleware authorization error", error);
//         return NextResponse.redirect(new URL("/login", req.url));
//      }
//     }
//     return NextResponse.next();
// }
// export const config = {
//   matcher: ["/admin/:path*", "/analyze/:path*"],
// };



