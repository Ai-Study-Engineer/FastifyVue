const { createApp, ref, computed, onMounted, watch } = Vue;
import { arraysOfObjectsEqual, fetchJSON } from './utils/helpers.js';
import {index} from './index.js';
import {loadTableData, loadQuestionsAndAnswers } from './load.js';
import {openai} from './openai.js';

createApp({
  setup() {
    const questions = ref([]);
    const answers = ref([]);
    const sql = ref('');
    const resultRows = ref([]);
    const resultColumns = ref([]);
    const allRows = ref([]);
    const allColumns = ref([]);
    const isCorrect = ref(null);
    const aiAnswer = ref('');

    const currentQuestion = computed(() => questions.value[index.value]);
    const currentAnswer = computed(() => answers.value[index.value]);
    const currentDb = computed(() => currentQuestion.value?.DBNAME);
    
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
      const data = await openai(sql.value, index.value);
      aiAnswer.value = data.aiAnswer || 'AIからの回答がありません。';
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
      await loadAndSetTableData(newIndex);        
    });

    async function loadAndSetTableData(idx) {
      const tableData = await loadTableData(idx);        
      allRows.value = tableData.allRows || [];
      allColumns.value = tableData.allColumns || [];
      
      sql.value = '';
      resultRows.value = [];
      resultColumns.value = [];
      isCorrect.value = null;
    }

    async function load(){
      const [qData, aData] = await loadQuestionsAndAnswers();
      questions.value = qData;
      answers.value = aData;

      await loadAndSetTableData(index.value);        
    }

    onMounted(load);

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
      executeSQL,
      prevQuestion,
      nextQuestion,
      checkAnswerCorrectness,
      askAI,      
      loadTableData,
      loadQuestionsAndAnswers,
      load,
    };
  },
}).mount('#app');
