import React, { useState } from "react";
import axios from "axios";



export default function ChatOpenAI(){
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");

    const HTTP = 'https://api.openai.com/v1/chat/completion';
    const handleSubmit = (e: any) => {
        e.preventDefault();
        axios.post(`${HTTP}`, {prompt}).then((res)=> setResponse(res.data)).catch(error=> console.log(error));
    }
    const handlePrompt = (e: any) => {
        setPrompt(e.target.value);
    }
    return(
        <div className="container container-sm p-1">
            <h1 className="title text-center text-darkGreen">Need more insights ? Ask here</h1>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="">Ask Questions</label>
                    <input  type="text" className="shadow-sm" placeholder="Enter text" value={prompt} onChange={handlePrompt}/>
                </div>
            </form>
            <div className="bg-darkGreen mt-2 p-1 border-5">
                <p className="text-light">{response ? response : "Hello! how may I help you?"}</p>
            </div>
        </div>
    );
}