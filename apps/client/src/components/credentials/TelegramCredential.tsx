import { useEffect, useState } from 'react';
import { Input } from "../ui/input"

const TgCredentials = ({onDataChange}: {onDataChange: (state : {} )=>void }) => {
    const [apikey,setApiKey] = useState("");

    useEffect(()=>{
        onDataChange({apikey})
    },[apikey,onDataChange])
  return (
    <div className="flex flex-col gap-2 mb-5 font-vietnam">
       
      <label className="text-black font-bold font-vietnam">Access Token<span className="text-violetPurple">*</span></label>
      <Input placeholder="Access Token" required  onChange={(e)=>setApiKey(e.target.value)}/>
    </div>
  )
}

export default TgCredentials