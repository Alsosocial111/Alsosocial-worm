import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") || "").trim().slice(0,100);
    const email = String(form.get("email") || "").trim().slice(0,200);
    const company = String(form.get("company") || form.get("business") || "").trim().slice(0,200);
    const service = String(form.get("service") || "").trim().slice(0,100);
    const message = String(form.get("message") || "").trim().slice(0,4000);
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) return NextResponse.json({error:"Please complete the required fields."},{status:400});
    const recipient = process.env.BOOKING_TO_EMAIL;
    if (!recipient) return NextResponse.json({error:"Booking email is not configured."},{status:503});
    const payload = new URLSearchParams({
      name,email,company,service,message,
      _subject:"AlsoSocial — New website enquiry",
      _replyto:email,
      _captcha:"true",
      _template:"table"
    });
    const result = await fetch("https://formsubmit.co/ajax/"+encodeURIComponent(recipient), {
      method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","Accept":"application/json"},body:payload.toString(),cache:"no-store",signal:AbortSignal.timeout(15000)
    });
    const data = await result.json().catch(()=>null);
    if (!result.ok || !data || data.success === "false" || data.success === false) return NextResponse.json({error:"Unable to send enquiry. Please try again."},{status:502});
    return NextResponse.redirect(new URL("/contact?sent=1",req.url),303);
  } catch(e) {console.error("Booking submission error",e);return NextResponse.json({error:"Unable to send enquiry. Please try again."},{status:500});}
}
