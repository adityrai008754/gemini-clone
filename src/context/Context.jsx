import { createContext, useState } from "react";
import run from "../config/gemeni";

export const Context = createContext()



const ContextProvider=(props)=>{

    const [input ,setInput]=useState("")
const [recentPrompt, setRecentPrompt] = useState("")
const [prevPrompts,setPrevPrompt] = useState([])
const [showResults , setShowResults] =useState(false)
const [loading,setLoading] =useState(false)
const [resultData,setResultData] = useState("")
// typing effect
const delayPara = async(index,nextWord) =>{
    setTimeout(function(){
        setResultData(prev=>prev+nextWord)
    },75*index)

}

const newChat  = () =>{
    setLoading(false)
    setShowResults(false)
}


const onSent = async (prompt) =>{

    setResultData("")
    setLoading(true)
    setShowResults(true)
    let respons;
    if(prompt!==undefined){
        respons=await run(prompt)
        setRecentPrompt(prompt)
    }else{
        setPrevPrompt(prev=>[...prev,input])
        setRecentPrompt(input)
        respons=await run(input)
    }
    // setRecentPrompt(input)
    // setPrevPrompt(prev=>[...prev,input])
    // const response = await run(input)
    let responseArray = respons.split("**")
    let newResponse="";
    for(let i =0;i<responseArray.length;i++){
        if(i===0 || i%2!==1){
            newResponse+=responseArray[i]
        }
        else{
            newResponse+="<b>"+responseArray[i] + "</b>"
        }
    }
    let newRespnse2 = newResponse.split("*").join("</br>")
    // setResultData(newRespnse2)
    let newResponseArray = newRespnse2.split(" ")
    for(let i=0;i<newResponseArray.length ; i++){
        const nextWord = newResponseArray[i]
        delayPara(i,nextWord+" ")
    }
    setLoading(false)
    setInput("")

}



    const contextValue ={
        prevPrompts,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResults,
        loading,
        resultData,
        input,
        setInput,
        newChat

    }
    return (<Context.Provider value={contextValue}>
        {props.children}
    </Context.Provider>)
}
export default ContextProvider