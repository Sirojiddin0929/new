import otp from "otp-generators"

export const generateOtp=()=>{
    const result=otp.generate(8,{alphabets:true,upperCase:true,specialChar:true})
    return result
}