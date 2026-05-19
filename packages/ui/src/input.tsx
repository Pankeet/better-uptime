import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
type Size = "xs" | "ss" | "sm" | "md" | "lg";

type InputProps = {
    readonly type : string,
    readonly isPassword : boolean,
    readonly label : string,
    readonly placeholder? : string,
    readonly size : Size,
    readonly text_size : Size,
    readonly maxLength? : number
    readonly inputRef?: React.Ref<HTMLInputElement>
    readonly disabled?: boolean
}

const width = {
    xs: "w-full lg:w-44 p-2 lg:p-3",
    ss: "w-full lg:w-60 px-3 py-2 lg:px-3.5 lg:py-2.5",
    sm: "w-full lg:w-sm px-3.5 py-2 lg:px-4 lg:py-2.5",
    md: "w-full lg:w-md px-4 py-2 lg:px-4 lg:py-2.5",
    lg: "w-full lg:w-lg px-4 py-2 lg:px-4.5 lg:py-2.5"
};

const textSize = {
    xs: "text-sm",
    ss: "text-base",
    sm: "text-base",
    md: "text-lg",
    lg: "text-lg"
}

const labelsize = {
    xs :"lg:text-sm mb-1",
    ss :"lg:text-sm mb-1",
    sm: "lg:text-md mb-1.5",
    md: "lg:text-lg mb-1.5",
    lg: "lg:text-xl mb-2"
}

function NormalInput( {Props} : Readonly<{Props :InputProps}>){
    return  <input 
                ref={Props.inputRef} 
                type={Props.type} 
                disabled={Props.disabled}
                placeholder={Props.placeholder} 
                className={`border-none mt-2 bg-[#384150] rounded-lg ${width[Props.size]} ${textSize[Props.text_size]} ${Props.disabled ? "bg-gray-700 cursor-not-allowed opacity-85" : ""}`} maxLength={Props.maxLength} />
}

function PassWordInput( {Props} : Readonly<{Props: InputProps}>){

    const [ visiblePassword, setVisiblePassword ] = useState<boolean>(false);

    return <div className="relative w-full">
                <div>
                    <input ref={Props.inputRef}
                            type={visiblePassword ? "text" : "password"}
                            onBlur={() => setVisiblePassword(false)}
                            className={`w-full border-none mt-2 bg-[#384150] rounded-lg pr-11 ${width[Props.size]} ${textSize[Props.text_size]}`} />
                </div>
                
                <button type="button" onClick={() => setVisiblePassword(!visiblePassword)} className="absolute right-4 lg:top-8 top-7 -translate-y-1/2 cursor-pointer">
                    {visiblePassword ? <Eye width={20} height={20}/> : <EyeOff width={20} height={20}/>}
                </button>
        </div>
}

export default function InputForm(Props : InputProps){
    return (
        <main>
            <div className={`${labelsize[Props.size]}`}>{Props.label + " "}*</div>
            {!Props.isPassword && <NormalInput Props={Props} />}
            
            {Props.isPassword && <PassWordInput Props={Props} />}
        </main>
    )
}