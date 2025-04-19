const { createApp } = Vue;
import { arraysOfObjectsEqual } from './utils/helpers.js';

createApp({
  data() {
    return {
      questions: [],
      answers: [],
      sql: '',
      result: [],
      columns: [],
      allRows: [],
      allColumns: [],
      index: 0,
      isCorrect: null,
      DB: "usersDB"
    };
  },

  computed: {
    currentQuestion() {
      return this.questions[this.index];
    },
    currentAnswer() {
      return this.answers[this.index];
    },
    currentDb() {
      return this.questions[this.index]?.DBNAME;
    }
  },

  methods: {
    async fetchJSON(url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      return await res.json();
    },

    async loadInitialData() {
      try {
        const [questionsData, answersData, tableData] = await Promise.all([
          this.fetchJSON('/api/questions'),
          this.fetchJSON('/api/answers'),
          this.fetchJSON(`/api/table/${this.index}`),
        ]);

        this.questions = questionsData;
        this.answers = answersData;
        this.allRows = tableData.allRows || [];
        this.allColumns = tableData.allColumns || [];

      } catch (error) {
        console.error('初期データ読み込み失敗:', error);
      }
    },

    async executeSQL() {
      try {
        const res = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: this.sql, index: this.index }),
        });

        const data = await res.json();
        this.result = data.rows || [];
        this.columns = data.columns || [];        

      } catch (err) {
        alert('SQL実行エラー');
      }
    },

    checkAnswerCorrectness() {
      this.isCorrect = arraysOfObjectsEqual(this.result, this.answers[this.index]?.rows);
    },

    prevQuestion() {
      if (this.index > 0) this.index--;
    },

    nextQuestion() {
      if (this.index < this.questions.length - 1) this.index++;
    },
  },

  async mounted() {
    await this.loadInitialData();
  }
}).mount('#app');
