type size = "xs" |"sm" | "md" | "lg";

type inputProps = {
    readonly type : string,
    readonly isPassword : boolean,
    readonly label : string,
    readonly placeholder? : string,
    readonly size : size,
    readonly text_size : size
}

const width = {
    xs: "lg:w-44 lg:px-3 lg:py-3 text-xs",
    sm: "lg:w-sm lg:px-4 lg:py-2 text-md",
    md: "lg:w-md lg:px-5 lg:py-3 text-lg",
    lg: "lg:w-lg lg:px-5 lg:py-3 text-lg"
};

const labelsize = {
    xs :"lg:text-sm mb-1",
    sm: "lg:text-md mb-1",
    md: "lg:text-lg mb-1",
    lg: "lg:text-xl mb-2"
}

export default function InputForm(Props : inputProps){
    return (
        <main>
            <div className={`${labelsize[Props.size]}`}>{Props.label}*</div>
            <input type={Props.type} placeholder={Props?.placeholder} className={`border-none px-4 py-3 bg-[#384150] rounded-lg ${width[Props.size]}`}/>
        </main>
    )
}