type size = "xs" | "ss" | "sm" | "md" | "lg";

type inputProps = {
    readonly type : string,
    readonly isPassword : boolean,
    readonly label : string,
    readonly placeholder? : string,
    readonly size : size,
    readonly text_size : size,
    readonly maxlength? : number
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

export default function InputForm(Props : inputProps){
    return (
        <main>
            <div className={`${labelsize[Props.size]}`}>{Props.label + " "}*</div>
            <input type={Props.type} placeholder={Props?.placeholder} className={`border-none mt-2 bg-[#384150] rounded-lg ${width[Props.size]} ${textSize[Props.text_size]}`} maxLength={Props.maxlength} />
        </main>
    )
}