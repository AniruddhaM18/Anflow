import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const ResendCredential = ({onDataChange}: {onDataChange: (state : {} )=>void }) => {
    const [apikey,setApiKey] = useState("");

    useEffect(()=>{
        onDataChange({apikey})
    },[apikey,onDataChange])
  return (
    <div className="font-inter flex flex-col gap-2 mb-5">
      <div className="text-center">
        Sign Up at{" "}
        <a href="https://resend.com/home" target="_blank" className="underline text-black dark:text-white">
          Resend
        </a>{" "}
        and Provide the API key for it!
      </div>{" "}
      <label className="text-black font-bold font-kode dark:text-orange-500">Resend API Key<span className="text-red-600">*</span></label>
      <Input placeholder="re_M2ynsineysbsk.." required  onChange={(e)=>setApiKey(e.target.value)}/>
    </div>
  );
};

export default ResendCredential;