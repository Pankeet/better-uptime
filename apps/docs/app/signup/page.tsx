import InputForm from "@repo/ui/input";

export default function SignUp(){
    return <main className="grid lg:grid-cols-2 min-h-screen text-white" >
        <section className="flex flex-col min-h-screen bg-[#121927]">
            <span className="text-3xl text-center text-white pt-9 lg:pt-12">Lets get Started !</span>
            <form className="flex flex-col justify-center lg:items-start items-center mt-20 gap-6 px-12 sm:px-10 lg:px-20">
                <InputForm type="email" label="Work Email" placeholder="jsonroy@gmail.com" isPassword={false} size="lg" text_size="lg"/>
                <InputForm type="number" label="OTP" isPassword={true} size="xs" text_size="xs" />
                <InputForm type="text" label="First Name" placeholder="Json" isPassword={false} size="md" text_size="sm"/>
                <InputForm type="email" label="Last Name" placeholder="Roy" isPassword={false} size="md" text_size="sm"/>
            </form>
        </section>
        <section className="lg:col-span-1 hidden lg:block bg-[#273240] min-h-full" />
    </main>
}