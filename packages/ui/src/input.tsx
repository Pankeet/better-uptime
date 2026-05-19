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
    readonly inputRef?: React.RefObject<HTMLInputElement | null>
}

const width = {
    xs: "lg:w-44 lg:p-3 p-2 ",
    ss: "lg:w-60 lg:px-3.5 lg:py-2.5 ",
    sm: "lg:w-sm lg:px-4 lg:py-2.5",
    md: "lg:w-md lg:px-4 lg:py-2.5",
    lg: "lg:w-lg lg:px-4.5 lg:py-2.5"
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
    sm: "lg:text-md mb-2",
    md: "lg:text-lg mb-2",
    lg: "lg:text-xl mb-2"
}

function NormalInput( {Props} : Readonly<{Props :InputProps}>){
    return  <input 
                ref={Props.inputRef} 
                type={Props.type} 
                placeholder={Props.placeholder} 
                className={`border-none mt-2 bg-[#384150] rounded-lg ${width[Props.size]} ${textSize[Props.text_size]}`} maxLength={Props.maxLength} />
}

function PassWordInput( {Props} : Readonly<{Props: InputProps}>){

    const [ visiblePassword, setVisiblePassword ] = useState<boolean>(false);

    return <div className="relative w-fit">
                <div>
                    <input ref={Props.inputRef}
                            type={visiblePassword ? "text" : "password"}
                            onBlur={() => setVisiblePassword(false)}
                            className={`border-none mt-2 bg-[#384150] rounded-lg pr-10 ${width[Props.size]} ${textSize[Props.text_size]}`} />
                </div>
                
                <button type="button" onClick={() => setVisiblePassword(!visiblePassword)} className="absolute right-4 top-8 -translate-y-1/2 cursor-pointer">
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