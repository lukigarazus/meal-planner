<template>
  <Card :title="name">
    <Input
      v-model="value"
      :value="value"
      :disabled="!future"
      :title="!future?'Can\'t plan for the present or the past':''"
    />
  </Card>
</template>

<script>
import { Card, Input } from "ant-design-vue";
import debouce from "lodash.debounce";
export default {
  props: ["name", "db", "meal", "date", "future"],
  data() {
    return {
      value: this.meal ? this.meal.value : "",
      loading: false,
      mealObj: this.meal
    };
  },
  updated: debouce(async function() {
    if (!this.mealObj) {
      const id = await this.db.meals.add({
        value: "",
        name: this.name,
        date: this.date,
        ings: false
      });
      this.mealObj = await this.db.meals.get(id);
    }
    this.db.meals.update(this.mealObj.id, { value: this.value });
  }, 500),
  watch: {
    meal(newV, oldV) {
      this.value = newV.value;
    }
  },
  components: { Card, Input }
};
</script>

<style scoped>
</style>
