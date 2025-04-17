const { createApp } = Vue;

createApp({
  data() {
    return {
      questions: [],
      sql: '',
      result: [],
      columns: [],
    };
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
      } catch (err) {
        alert('SQL実行エラー');
      }
    },
  },
  mounted() {
    fetch('/api/questions')
      .then((res) => res.json())
      .then((data) => {
        this.questions = data;
      });
  },
}).mount('#app');
