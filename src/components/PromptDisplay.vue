<script setup>
import storyData from "../data/story_start.json";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getResponse } from "../resources/gemini.js";
import { ref, nextTick } from "vue";


const currentSceneKey = ref("start")
const summary = ref(storyData.scenes["start"].scene_summary);
const text = ref(storyData.scenes["start"].text);
const choices = ref(storyData.scenes["start"].choices);
const loading = ref(false);


const generateNextScene = async (newSceneKey) => {
   const exampleSceneJSON = storyData.scenes[currentSceneKey.value];
   const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
   const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
   });
   const prompt = `Return the next scene of a story for key ${newSceneKey}. The scene should be formatted in plain JSON (without any formatting like newlines, etc) like this, the scene before: ${JSON.stringify(
      exampleSceneJSON
   )}. Don't make the text too long - keep it vivid and interesting. A max of 3 new and interesting choices at the scene should be enough - no need for a go back or a similar option, the choices should take the character forward into the story. The main plot line of the story is ${storyData.plot}.`;
   // console.log("Prompt: ", prompt);

   const response = await model.generateContent(prompt);
   const responseJSON = JSON.parse(response.response.text());

   // console.log("Response JSON: ", responseJSON);

   summary.value = responseJSON.scene_summary;
   text.value = responseJSON.text;
   choices.value = responseJSON.choices;

   storyData.scenes[newSceneKey] = responseJSON;

   loading.value = false;
}


const select = async (choice) => {
   // if the current scene is in the story data, display it
   if (storyData.scenes[choice.scene_key]) {
      summary.value = storyData.scenes[choice.scene_key].scene_summary;
      text.value = storyData.scenes[choice.scene_key].text;
      choices.value = storyData.scenes[choice.scene_key].choices;
   }
   else {   // otherwise, generate the next scene and write it to the story data
      loading.value = true;
      generateNextScene(choice.scene_key);
   }

   currentSceneKey.value = choice.scene_key;
};


const showStoryData = () => {
   console.log("Story Data: ", storyData);
};
</script>


<template>
   <div v-if="loading">
      <h3>playing suspenseful music....</h3>
   </div>
   <div v-else>
      <h3>{{ summary }}</h3>
      <p>{{ text }}</p>
      <label v-for="choice in choices" :key="choice">
         <button @click="select(choice)" style="margin-right: 12px;">{{ choice.text }}</button>
      </label>
   </div>

   <div>
      <br><br><br>
      <button @click="showStoryData()">Show Story Data</button>
   </div>
</template>


<style scoped>
</style>