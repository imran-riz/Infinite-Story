import { GoogleGenerativeAI } from "@google/generative-ai";


const getResponse = async (prompt) => {
   const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
   const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
   });

   const result = await model.generateContent(prompt);

   console.log(result.response.text());
   
};

const generateNextScene = async (sceneKey, exampleSceneJSON, plot) => {
   const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
   const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
   });
   
   const prompt = `Return the next scene of a story for key ${sceneKey}. An example scene should be formatted in plain JSON (without any formatting like newlines, etc) like this: ${JSON.stringify(
     exampleSceneJSON
   )}. Don't make the text too long - keep it vivid and interesting. The main plot line of the story is ${plot}.`;
   // console.log("Prompt: ", prompt);
   
   const response = await model.generateContent(prompt);
   const responseText = response.response.text();
   const responseJSON = JSON.parse(responseText);

   console.log("Response JSON: ", responseJSON);
   
   return responseJSON;
}


export {
   getResponse, 
   generateNextScene
};