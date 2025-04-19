const { createApp, ref, computed, onMounted, watch } = Vue;
import { arraysOfObjectsEqual } from './utils/helpers.js';

createApp({
  setup() {
    const questions = ref([]);
    const answers = ref([]);
    const sql = ref('');
    const resultRows = ref([]);
    const resultColumns = ref([]);
    const allRows = ref([]);
    const allColumns = ref([]);
    const index = ref(0);
    const isCorrect = ref(null);
    const aiAnswer = ref('');

    const currentQuestion = computed(() => questions.value[index.value]);
    const currentAnswer = computed(() => answers.value[index.value]);
    const currentDb = computed(() => currentQuestion.value?.DBNAME);

    async function fetchJSON(url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      return await res.json();
    }

    async function loadQuestionsAndAnswers() {
      const [qData, aData] = await Promise.all([
        fetchJSON('/api/questions'),
        fetchJSON('/api/answers'),
      ]);
      questions.value = qData;
      answers.value = aData;
    }

    async function loadTableData(idx) {
      try {
        const tableData = await fetchJSON(`/api/table/${idx}`);
        allRows.value = tableData.allRows || [];
        allColumns.value = tableData.allColumns || [];
      } catch (error) {
        console.error('テーブルデータ読み込み失敗:', error);
      }
    }

    async function loadInitialData() {
      try {
        await loadQuestionsAndAnswers();
        await loadTableData(index.value);
      } catch (error) {
        console.error('初期データ読み込み失敗:', error);
      }
    }

    async function executeSQL() {
      try {
        const res = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: sql.value, index: index.value }),
        });
        const data = await res.json();
        resultRows.value = data.rows || [];
        resultColumns.value = data.columns || [];
        checkAnswerCorrectness();
      } catch (err) {
        alert('SQL実行エラー');
      }
    }

    async function askAI() {  
      try{
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: sql.value, index: index.value }),
        });
        const data = await res.json();
        aiAnswer.value = data.aiAnswer || 'AIからの回答がありません。';
      }
      catch (err) {
        alert('AIへの問い合わせエラー');
      }
    }

    function checkAnswerCorrectness() {
      isCorrect.value = arraysOfObjectsEqual(resultRows.value, answers.value[index.value]?.rows);
    }

    function prevQuestion() {
      if (index.value > 0) index.value--;
    }

    function nextQuestion() {
      if (index.value < questions.value.length - 1) index.value++;
    }

    watch(index, async (newIndex) => {
      await loadTableData(newIndex);
      sql.value = '';
      resultRows.value = [];
      resultColumns.value = [];
      isCorrect.value = null;
    });

    onMounted(loadInitialData);

    return {
      questions,
      answers,
      sql,
      result: resultRows,
      columns: resultColumns,
      allRows,
      allColumns,
      index,
      isCorrect,
      currentQuestion,
      currentAnswer,
      currentDb,
      aiAnswer,
      fetchJSON,
      loadInitialData,
      executeSQL,
      prevQuestion,
      nextQuestion,
      checkAnswerCorrectness,
      askAI,      
    };
  },
}).mount('#app');
