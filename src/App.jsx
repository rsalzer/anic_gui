import "./App.css";
import { executePrompt, getModels } from "./anic.js";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { SliderSetting } from "./SliderSetting.jsx";
import { DropdownSetting } from "./DropdownSetting";

function App() {
  const [accessKey, setAccessKey] = useLocalStorage("anic_gui_openaikey", "");
  const [userPrompt, setUserPrompt] = useState(
    "Ein neuronales Netzwerk mit Namen Anic schreibt eine total verrückte Kolumne für eine überregionale deutsche Zeitung. Sie ist bekannt für ihren stilistischen Witz und ihre ungewöhnlichen Blickwinkel. Dies ist die erste Kolumne von Anic und sie wird die Leser*innen vom Hocker hauen."
  );
  const [results, setResults] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    temperature: 0.9,
    presence_penalty: 1.8,
    frequency_penalty: 1.89,
    tokensWanted: 4096,
    model: "text-davinci-002",
  });
  const zeichenCount = results.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.length;
  }, 0);
  const [availableModels, setAvailableModels] = useState(["text-davinci-002"]);
  console.log(settings);

  const executeAnic = async () => {
    const prompt = userPrompt;
    const newPrompt =
      results.length == 0
        ? userPrompt + "\n\n"
        : userPrompt + "\n\n" + results.join("\n") + "\n"; // results.join('\n')+'\n'
    console.log("NewPrompt", newPrompt);
    setIsExecuting(true);
    const text = await executePrompt(newPrompt, settings, accessKey);
    setIsExecuting(false);
    console.log("Received Text", text);
    if (text) {
      const newResults = [...results];
      newResults.push(text);
      setResults(newResults);
    }
  };

  useEffect(() => {
    (async () => {
      const models = await getModels();
      console.log(models);
      setAvailableModels(models);
    })();
    console.log("Initial Use Effect");
  }, []);

  return (
    <div className="App">
      <h2>ANIC GUI (Intern)</h2>
      {/*<input*/}
      {/*  type="text"*/}
      {/*  value={accessKey}*/}
      {/*  width={100}*/}
      {/*  placeholder="OPEN-AI Access Key"*/}
      {/*  onChange={(event) => setAccessKey(event.target.value)}*/}
      {/*/>*/}
      {/*<br />*/}
      Initialer Prompt:
      <br />
      <div style={{ maxWidth: "660px", margin: "0 auto" }}>
        <textarea
          rows="6"
          cols="80"
          value={userPrompt}
          onChange={(event) => setUserPrompt(event.target.value)}
          style={{ maxWidth: "100%" }}
        />
        <br />
        {isExecuting ? (
          <button disabled>ANIC lädt...</button>
        ) : (
          <>
            <button onClick={executeAnic}>Nächsten Prompt starten</button>
            <button onClick={() => setResults([])}>Zurücksetzen</button>
            <button
              onClick={() => setShowSettings((showSettings) => !showSettings)}
            >
              Einstellungen {showSettings ? `verbergen` : "anzeigen"}
            </button>
          </>
        )}
        <br />
        <div
          style={{
            display: showSettings ? "block" : "none",
          }}
        >
          <DropdownSetting
            name={"Model"}
            values={availableModels}
            selectedValue={settings.model}
            onValueChanged={(value) =>
              setSettings({ ...settings, model: value })
            }
          />
          <SliderSetting
            onValueChanged={(value) =>
              setSettings({ ...settings, temperature: value })
            }
            name={"Temperature"}
            value={settings.temperature}
            divider={100}
            min={0}
            max={1}
          />
          {/*<div>{settings.temperature}</div>*/}
          <SliderSetting
            onValueChanged={(value) =>
              setSettings({ ...settings, presence_penalty: value })
            }
            name={"Presence-Penalty"}
            value={settings.presence_penalty}
            divider={100}
            min={-2}
            max={2}
          />
          {/*<div>{settings.presence_penalty}</div>*/}
          <SliderSetting
            onValueChanged={(value) =>
              setSettings({ ...settings, frequency_penalty: value })
            }
            name={"Frequency-Penalty"}
            value={settings.frequency_penalty}
            divider={100}
            min={-2}
            max={2}
          />
        </div>
      </div>
      Zeichencount: {zeichenCount}
      <h3>Resultat</h3>
      {/*<div>*/}
      {/*  <h4>Prompt:</h4>*/}
      {/*  <b>{userPrompt}</b>*/}
      {/*</div>*/}
      <div>
        {results.map((singleText, index) => (
          <div key={singleText + index}>
            <div
              dangerouslySetInnerHTML={{
                __html: singleText.replace(/(?:\r\n|\r|\n)/g, "<br>"),
              }}
            />
            {index === results.length - 1 && (
              <button onClick={() => setResults(results.slice(0, -1))}>
                Diesen Teil löschen
              </button>
            )}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
