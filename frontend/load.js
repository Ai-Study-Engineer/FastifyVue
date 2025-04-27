import {fetchJSON } from './utils/helpers.js';

export async function loadQuestionsAndAnswers() {
    const [qData, aData] = await Promise.all([
    fetchJSON('/api/questions'),
    fetchJSON('/api/answers'),
    ]);
    return [qData, aData];    
}

export async function loadTableData(idx) {
    const tableData = await fetchJSON(`/api/table/${idx}`);        
    return tableData;
}
