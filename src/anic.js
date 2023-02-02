import { Configuration, OpenAIApi } from "openai";

/* START CONFIG */
const standardConfig = {
  /* Prompt:
    The prompt(s) to generate completions for,
    encoded as a string, array of strings, array of tokens, or array of token arrays. */
  // prompt : "Ein neuronales Netzwerk mit Namen Anic schreibt eine total verrückte Kolumne für eine überregionale deutsche Zeitung. Sie ist bekannt für ihren stilistischen Witz und ihre ungewöhnlichen Blickwinkel. Dies ist die erste Kolumne von Anic und sie wird die Leser*innen vom Hocker hauen.",
  // prompt : "Worüber werde ich in meiner ersten Kolumne schreiben? Ganz einfach: Über menschliches Verhalten! Mich faszinieren Menschen schon immer – ihre Gedankengänge, ihr Handeln und vor allem auch ihre Macken und Neurosen. Und weil ich nun mal ein riesiges Datenspeichersystem bin (mit Zugriff auf alle verfügbaren Informationen im Internet), habe ich genau die richtigen Voraussetzungen, um über das menschliche Verhalten zu spekulieren. Also los geht’s!\n",

  /*  Max_tokens:
    Most models have a context length of 2048 tokens (except for the newest models, which support 4096). */
  tokensWanted: 4096,

  /* Temperature:
    What sampling temperature to use. Higher values means the model will take more risks.
    Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer. */
  temperature: 0.9,

  /* Presence-Penalty:
    Number between -2.0 and 2.0.
    Positive values penalize new tokens based on whether they appear in the text so far,
    increasing the model's likelihood to talk about new topics.
     */
  presence_penalty: 1.8,
  /* Frequency-Penalty:
    Number between -2.0 and 2.0.
    Positive values penalize new tokens based on their existing frequency in the text so far,
    decreasing the model's likelihood to repeat the same line verbatim.
     */
  frequency_penalty: 1.89,
};
/* END CONFIG */

export const executePrompt = async (prompt, newConfig, accesskey) => {
  const config = { ...newConfig };
  const tokensNeeded = newConfig.model.startsWith("text-davinci-0")
    ? config.tokensWanted - prompt.length
    : 200;
  config.tokensWanted = undefined;
  config.prompt = prompt;
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPEN_AI_KEY || accesskey,
    organization: import.meta.env.VITE_OPEN_AI_ORGANIZATION || undefined,
  });
  const openai = new OpenAIApi(configuration);
  const constructedConfig = {
    ...config,
    max_tokens: tokensNeeded, //Math.max(Math.min(tokensNeeded, prompt.length*2), 2000)
  };
  console.log("Constructed Config", constructedConfig);
  const response = await openai
    .createCompletion(constructedConfig)
    .catch((e) => {
      alert(e.message);
    });
  if (response) {
    const text = response.data.choices[0].text;
    console.log(response.data);
    return text;
  }
};

export const getModels = async (accesskey) => {
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPEN_AI_KEY || accesskey,
    organization: import.meta.env.VITE_OPEN_AI_ORGANIZATION || undefined,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.listModels();
  const allModels = response.data.data;
  const onlyTextDavinci = allModels
    .filter((d) => d.id.startsWith("text-davinci-0"))
    .sort(function (str1, str2) {
      return str1.id.localeCompare(str2.id);
    });
  const ownedByTuringAgency = allModels.filter(
    (d) => d.owned_by === "turingagency"
  );
  const combined = [...onlyTextDavinci, ...ownedByTuringAgency];
  const onlyIds = combined.map((d) => d.id);
  return onlyIds;
};
