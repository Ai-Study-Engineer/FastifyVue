const { createApp } = Vue;

createApp({
  data() {
    return {
      questions: [],
    };
  },
  mounted() {
    fetch('/api/questions')
      .then((res) => res.json())
      .then((data) => {
        this.questions = data;
      });
  },
}).mount('#app');
