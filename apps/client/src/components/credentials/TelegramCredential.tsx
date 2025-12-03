import { useEffect, useState } from 'react';
import { Input } from "../ui/input"

const TgCredentials = ({onDataChange}: {onDataChange: (state : {} )=>void }) => {
    const [apikey,setApiKey] = useState("");

    useEffect(()=>{
        onDataChange({apikey})
    },[apikey,onDataChange])
  return (
    <div className="flex flex-col gap-2 mb-5 font-vietnam">
        <div className="text-center">
            Sign Up at{" "}
            <a href="https://t.me/BotFather" target="_blank" className="underline text-blue-400">
            Telegram (BotFather)
            </a>{" "}
            and Provide the Bot Access Token by Creating a bot at Botfather!
        </div>{" "}
      <label className="text-black font-bold dark:text-orange-500 font-vietnam">Access Token<span className="text-red-600">*</span></label>
      <Input placeholder="Access Token" required  onChange={(e)=>setApiKey(e.target.value)}/>
    </div>
  )
}

export default TgCredentials