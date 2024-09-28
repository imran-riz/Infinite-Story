<script setup>
import storyData from "../data/story_start.json";
import getRespose from "../resources/gemini.js";
import { ref } from "vue";


const summary = ref("");
const text = ref("");
const choices = ref([]);
const promptText = ref("");

// initialise the first scene
summary.value = storyData.scenes["start"].scene_summary;
text.value = storyData.scenes["start"].text;
choices.value = storyData.scenes["start"].choices;


const select = (choice) => {
   summary.value = storyData.scenes[choice.scene_key].scene_summary;
   text.value = storyData.scenes[choice.scene_key].text;
   choices.value = storyData.scenes[choice.scene_key].choices;
};
</script>


<template>
   <div>
      <h3>{{ summary }}</h3>
      <p>{{ text }}</p>
      <label v-for="choice in choices" :key="choice">
         <button @click="select(choice)" style="margin-right: 12px;">{{ choice.text }}</button>
      </label>
   </div>

   <div>
      <input type="text" v-model="promptText" />
      <button @click="getRespose(promptText)">Send</button>
   </div>
</template>


<style scoped>
</style>