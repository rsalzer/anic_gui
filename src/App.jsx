import './App.css'
import {executePrompt} from "./anic.js";
import {useState} from "react";
function App() {
  const [accessKey, setAccessKey] = useState("")
  const [userPrompt, setUserPrompt] = useState("Ein neuronales Netzwerk mit Namen Anic schreibt eine total verrückte Kolumne für eine überregionale deutsche Zeitung. Sie ist bekannt für ihren stilistischen Witz und ihre ungewöhnlichen Blickwinkel. Dies ist die erste Kolumne von Anic und sie wird die Leser*innen vom Hocker hauen.")
  const [results, setResults] = useState([])
  const [initialPrompt, setInitialPrompt] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const zeichenCount = results.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.length
  }, 0)

  const executeAnic = async() => {
    const prompt = userPrompt
    const newPrompt = results.length==0 ? userPrompt+'\n\n' : userPrompt+'\n\n'+results.join('\n')+'\n'; // results.join('\n')+'\n'
    console.log("NewPrompt", newPrompt)
    setIsExecuting(true)
    const text = await executePrompt(newPrompt, accessKey)
    setIsExecuting(false)
    console.log("Received Text", text)
    if(text) {
      const newResults = [...results]
      newResults.push(text)
      setResults(newResults)
    }
  }

  return (
    <div className="App">
      <h2>ANIC GUI</h2>
      <input type="text" value={accessKey} width={100} placeholder="OPEN-AI Access Key" onChange={(event) => setAccessKey(event.target.value)}/><br/>
      Initialer Prompt:<br/>
      <textarea rows="6" cols="80" value={userPrompt} onChange={(event) => setUserPrompt(event.target.value)}/><br/>
      {isExecuting ? (<button disabled>ANIC lädt...</button>): (
        <>
        <button onClick={executeAnic}>Nächsten Prompt starten</button>
        <button onClick={() => setResults([])}>Zurücksetzen</button>
        </>
      )}
      <br/>Zeichencount: {zeichenCount}
      <h3>Resultat</h3>
      {/*<div>*/}
      {/*  <h4>Prompt:</h4>*/}
      {/*  <b>{userPrompt}</b>*/}
      {/*</div>*/}
      <div>
        {results.map((singleText, index) => (
          <div key={singleText+index} >
          <div dangerouslySetInnerHTML={{__html: singleText.replace(/(?:\r\n|\r|\n)/g, '<br>')}}/>
            <hr/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
