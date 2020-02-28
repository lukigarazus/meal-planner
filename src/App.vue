<template>
  <div id="app">
    <Modal title="Settings" v-model="visible" :footer="null" @cancel="visible = false">
      <div class="horizontal-margin">How many meals do you want to eat?</div>
      <RadioGroup :defaultValue="numberOfMeals" v-model="numberOfMeals">
        <RadioOption v-for="item in POSSIBLE_STAGE_COUNTS" :key="item" :value="item">{{ item }}</RadioOption>
      </RadioGroup>
    </Modal>
    <Layout style="height:100%">
      <Header :class="{ green: true }">
        <h2>
          <span>Meal planner</span>
          <Tooltip>
            <template slot="title">
              <span>Settings</span>
            </template>
            <Icon @click="visible = true" class="settings" type="setting"/>
          </Tooltip>
        </h2>
      </Header>
      <Content>
        <div class="tiles-wrapper">
          <div class="tiles">
            <div class="calendar-wrapper">
              <Card>
                <Calendar :fullscreen="false" @select="selectDate">
                  <!-- <template slot="dateCellRender" slot-scope="value">
                    <span class="icon-wrapper">
                      <Icon type="check-circle"/>
                    </span>
                  </template>-->
                </Calendar>
              </Card>
            </div>
            <div class="day-wrapper">
              <Day
                :future="future"
                :stages="stages"
                :key="date"
                :db="db"
                :date="date"
                :meals="meals"
              />
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  </div>
</template>

<script>
import * as V from "ant-design-vue";
import Dexie from "dexie";
import Day from "./components/Day";
import {
  STAGES,
  POSSIBLE_STAGE_COUNTS,
  DEFAULT_STAGE_COUNT
} from "./constants";
import "ant-design-vue/dist/antd.css";

const { Layout, Calendar, Card, Icon, Tooltip, Modal, Radio } = V;

const { Header, Content } = Layout;
const { Group } = Radio;

const parseDate = d =>
  d
    .toString()
    .split(" ")
    .slice(0, 4)
    .join(" ");

export default {
  name: "App",
  data() {
    if (!localStorage.numberOfMeals) {
      localStorage.numberOfMeals = DEFAULT_STAGE_COUNT;
    }
    const date = parseDate(new Date());
    const db = new Dexie("meal-planner");
    db.version(1).stores({
      meals: "++id,name,date,value,ings"
    });
    // db.meals.clear()
    db.meals
      .where({ date: date })
      .toArray()
      .then(arr => {
        this.meals = arr;
      });
    return {
      db,
      date,
      meals: [],
      visible: false,
      numberOfMeals: +localStorage.numberOfMeals,
      stages: STAGES[+localStorage.numberOfMeals],
      future: false
    };
  },
  methods: {
    async updateMeals(date) {
      const meals = await this.db.meals.where({ date: date }).toArray();
      this.meals = meals;
    },
    async selectDate(date) {
      const future = date._d > new Date();
      this.future = future;
      const dateString = parseDate(date._d);
      await this.updateMeals(dateString);
      this.date = dateString;
    }
  },
  watch: {
    numberOfMeals(newV, oldV) {
      localStorage.numberOfMeals = newV;
      this.stages = STAGES[newV];
    }
  },
  created() {
    this.POSSIBLE_STAGE_COUNTS = POSSIBLE_STAGE_COUNTS;
  },
  components: {
    Layout,
    Header,
    Content,
    Calendar,
    Card,
    Day,
    Icon,
    Tooltip,
    Modal,
    RadioOption: Radio,
    RadioGroup: Group
  }
};
</script>

<style>
:root {
  --main-green: #95de64;
  --deeper-green: #52c41a;
}
.horizontal-margin {
  margin: 10px 0 10px 0;
}
#app {
  min-height: 100vh;
}
.ant-layout-header > h2 {
  display: flex;
  justify-content: space-between;
}
.settings {
  padding: 20px 0 20px 0;
  cursor: pointer;
}
.green {
  background: var(--main-green);
}
.tiles-wrapper {
  display: flex;
  justify-content: center;
  margin: 10px;
}
.tiles {
  display: grid;
  grid-auto-columns: auto;
  grid-gap: 10px;
  max-width: 768px;
  width: 100%;
}
.calendar-wrapper {
  width: 100%;
}
.icon-wrapper {
  position: absolute;
  top: -31px;
  left: 54px;
  color: var(--deeper-green);
}
</style>
