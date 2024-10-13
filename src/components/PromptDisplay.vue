<script setup>
import storyData from "../data/story_start.json";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ref, onBeforeMount } from "vue";


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
      await generateNextScene(choice.scene_key);
   }

   currentSceneKey.value = choice.scene_key;
};


const showStoryData = () => {
   console.log("Story Data: ", storyData);
};


onBeforeMount(() => {
   // add an event listener to the window object to listen for key presses and then select the corresponding choice
   window.addEventListener("keyup", (event) => {
      const index = event.key.toUpperCase().length === 1 ? event.key.toUpperCase().charCodeAt(0) - 65 : -1;

      if (index >= 0 && index < choices.value.length) {
         select(choices.value[index]);
      }
   });
});
</script>


<template>
   <div class="container">
      <div class="story-box">
         <h1>{{ summary }}</h1>
         <p>{{ text }}</p>
      </div>
      <div class="choices-box">
         <button v-for="(choice, index) in choices" :key="choice" @click="select(choice)">
            {{ String.fromCharCode(65 + index) }}. {{ choice.text }}
         </button>
      </div>
   </div>
</template>


<style scoped>
.container {
   text-align: center;
   background-color: #f5e0b3;
   padding: 40px;
   height: 100vh;
}

.story-box {
   background-color: #3a100c;
   color: white;
   font-family: Rosarivo,serif;
   padding: 40px;
   border-radius: 15px;
   margin-bottom: 60px;
   width: 1160px;
   height: 480px;
}

.story-box h1 {
   font-weight: normal;
   font-size: 40px;
   height: 15%;
   display: flex;
   justify-content: center;
   align-items: center;
}

.story-box p {
   font-size: 24px;
   font-weight: normal;
   height: 85%;
   padding: 20px;
   display: flex;
   justify-content: center;
   align-items: center;
}

.choices-box {
   display: flex;
   justify-content: center;
   gap: 20px;
}

.choices-box button {
   background-color: #654032;
   color: #E3D4B0;
   font-family: Rosarivo,serif;
   font-size: 20px;
   border: none;
   padding: 15px 25px;
   border-radius: 15px;
   cursor: pointer;
   flex-shrink: 0;
}
</style>