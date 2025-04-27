export function normalize(obj) {
    // オブジェクトのキーをソートして文字列化
    return JSON.stringify(
        Object.keys(obj).sort().reduce((acc, key) => {
            acc[key] = obj[key];
            return acc;
        }, {})
    );
}

export function arraysOfObjectsEqual(a, b) {
    if (a.length !== b.length) return false;

    const normalizedA = a.map(normalize).sort();
    const normalizedB = b.map(normalize).sort();

    return normalizedA.every((val, i) => val === normalizedB[i]);
}

export async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return await res.json();
  }
