<template>
  <div class="day tiles">
    <Meal
      v-for="stage in stages"
      :meal="getMeal(stage)"
      :key="stage + date"
      :name="stage"
      :db="db"
      :date="date"
      :future="future"
    />
  </div>
</template>
 <script>
import Meal from "./Meal";

export default {
  props: ["db", "meals", "date", "stages", "future"],
  data() {
    return {};
  },
  methods: {
    getMeal(stage) {
      const cached = this.cache[stage];
      if (cached) {
        return cached;
      }
      this.cache[stage] = this.meals.find(el => el.name === stage);
      return this.cache[stage];
    }
  },
  created() {
    this.cache = {};
  },
  components: {
    Meal
  }
};
</script>
 