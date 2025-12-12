import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const ResendCredential = ({onDataChange}: {onDataChange: (state : {} )=>void }) => {
    const [apikey,setApiKey] = useState("");

    useEffect(()=>{
        onDataChange({apikey})
    },[apikey,onDataChange])
  return (
    <div className="font-vietnam flex flex-col gap-2 mb-5">
  
      <label className="text-black font-bold font-vietnam">Resend API Key<span className="text-violetPurple">*</span></label>
      <Input placeholder="re_KJkszpj.." required  onChange={(e)=>setApiKey(e.target.value)}/>
    </div>
  );
};

export default ResendCredential;