import {signOut} from "@/lib/auth";
import {redirect} from "next/navigation";

export async function GET(request: Request) {
    const {success, message} = await signOut();
    redirect("/tournaments")
}