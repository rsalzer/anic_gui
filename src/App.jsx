import "./App.css";
import { chatGptPrompt, executePrompt, getModels } from "./anic.js";
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
  console.log(userPrompt, settings);

  const executeAnic = async () => {
    const prompt = userPrompt;
    const newPrompt =
      results.length == 0
        ? userPrompt + "\n\n"
        : userPrompt + "\n\n" + results.join("\n") + "\n"; // results.join('\n')+'\n'
    console.log("NewPrompt", newPrompt);
    setIsExecuting(true);
    const text = await executePrompt(newPrompt, settings, accessKey);
    // const text = await chatGptPrompt(newPrompt, settings, accessKey);
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
      Initialer Prompt:
      <br />
      <div style={{ maxWidth: "660px", margin: "0 auto" }}>
        <div
          contentEditable={true}
          onBlur={(event) => setUserPrompt(event.target.outerText)}
          style={{
            maxWidth: "100%",
            border: "solid 1px",
            whiteSpace: "pre-line",
            display: "inline-block",
          }}
          suppressContentEditableWarning={true}
        >
          {userPrompt}
        </div>
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
            max={2}
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
      <Results results={results} setResults={setResults} />
    </div>
  );
}

function Results({ results, setResults }) {
  const [newText, setNewText] = useState(null);

  const saveResult = () => {
    const newResults = [...results];
    newResults[newResults.length - 1] = newText;
    setResults(newResults);
    setNewText(null);
  };

  return (
    <div>
      {results.map((singleText, index) => (
        <div key={singleText + index}>
          {(index !== results.length - 1 || newText === null) && (
            <div
              dangerouslySetInnerHTML={{
                __html: singleText.replace(/(?:\r\n|\r|\n)/g, "<br>"),
              }}
            />
          )}
          {index === results.length - 1 && (
            <>
              {newText != null ? (
                <>
                  <div
                    contentEditable={true}
                    onBlur={(event) => setNewText(event.target.outerText)}
                    style={{
                      maxWidth: "100%",
                      border: "solid 1px",
                      whiteSpace: "pre-line",
                      display: "inline-block",
                    }}
                    suppressContentEditableWarning={true}
                  >
                    {newText}
                  </div>
                  <br />
                  <button onClick={() => setNewText(null)}>Abbrechen</button>
                  <button onClick={saveResult}>Speichern</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setNewText(results[results.length - 1])}
                  >
                    Diesen Teil ändern
                  </button>
                  <button onClick={() => setResults(results.slice(0, -1))}>
                    Diesen Teil löschen
                  </button>
                </>
              )}
            </>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
