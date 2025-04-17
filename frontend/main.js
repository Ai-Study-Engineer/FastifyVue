const { createApp } = Vue;
import {arraysOfObjectsEqual} from './utils/helpers.js';

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
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.index];
    },
    currentAnswer() {
      return this.answers[this.index];
    },
  },
  methods: {
    async executeSQL() {
      try {
        const res = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: this.sql }),
        });

        const data = await res.json();

        this.result = data.rows || [];
        this.columns = data.columns || [];
        const isCorrect = arraysOfObjectsEqual(this.result, this.allRows);
        console.log('isCorrect:', isCorrect);        
      } catch (err) {
        alert('SQL実行エラー');
      }
    },
    prevQuestion() {
      if (this.index > 0) this.index--;
    },
    nextQuestion() {
      if (this.index < this.questions.length - 1) this.index++;
    },
  },
  async mounted() {
    try {
      const questionsRes = await fetch('/api/questions');
      const questionsData = await questionsRes.json();
      this.questions = questionsData;

      const answersRes = await fetch('/api/answers');
      const answersData = await answersRes.json();
      this.answers = answersData;
  
      const tableRes = await fetch('/api/table');
      const tableData = await tableRes.json();
      this.allRows = tableData.allRows || [];
      this.allColumns = tableData.allColumns || [];
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
}).mount('#app');
