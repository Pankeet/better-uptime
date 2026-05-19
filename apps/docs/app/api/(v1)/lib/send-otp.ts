import { Resend } from "resend";
import { generateOtp } from "./crypt";

const resend = new Resend(
    process.env.RESEND_API_KEY
);

export async function sendOtp(email: string){

    const otp = generateOtp();
    
    try{
        const response =  await resend.emails.send({
            from:"onboarding@resend.dev",
            to: email,
            subject: "Verify your Email",
            html: `
            <div style="
                padding:20px;
                font-family:sans-serif;
            ">
                <h2>Email Verification</h2>

                <p>
                Your OTP is:
                </p>

                <h1>
                ${otp}
                </h1>

                <p>
                Valid for 2 minutes
                </p>
            </div>
            `
        })

        return {
            success: true,
            otp,
            response
        }

    }catch(err){
        console.error(err);
    }
}