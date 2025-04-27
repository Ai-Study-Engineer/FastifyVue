export async function openai (query, index){
    try{
    const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, index: index}),
    });
    return await res.json();
    }
    catch (err) {
    alert('AIへの問い合わせエラー');
    console.error(err);
    }
}