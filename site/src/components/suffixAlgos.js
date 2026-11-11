// 주제 09의 접미사 데모들이 함께 쓰는 계산과 참조 띠.
//
// 접미사 배열, LCP(Kasai), 무차별 대입을 algorithm-code의 topic-09-radix-sort와 같은
// 절차로 옮겼다. 비교 횟수를 세는 규칙도 실습 코드와 같다. drawStrip은 데모 안의 참조
// 띠(SuffixStrip.astro)를 채운다. 컴포넌트가 이 파일을 ?raw로 읽어 is:inline으로 넣는다.
(() => {
  if (globalThis.aasSuffixAlgos) return;

  /* 접미사 배열. 문자 코드 순 비교라 $(36)와 #(35)가 소문자보다 앞에 온다. */
  const buildSA = (text) => {
    const n = text.length;
    const cmp = (a, b) => {
      for (let k = 0; a + k < n && b + k < n; k++) {
        const d = text.charCodeAt(a + k) - text.charCodeAt(b + k);
        if (d) return d;
      }
      return b - a; // 먼저 끝나는 쪽(시작 위치가 뒤인 쪽)이 앞이다.
    };
    return Array.from({ length: n }, (_, i) => i).sort(cmp);
  };

  const rankOf = (sa) => {
    const r = new Array(sa.length);
    sa.forEach((p, j) => (r[p] = j));
    return r;
  };

  /* 04_lcp의 BuildLcpKasai. compares는 while 조건의 글자 비교 수다. */
  const kasai = (text, sa) => {
    const n = text.length;
    const rank = rankOf(sa);
    const lcp = new Array(n).fill(0);
    const rows = [];
    let h = 0;
    let total = 0;
    for (let i = 0; i < n; i++) {
      if (rank[i] === 0) {
        h = 0;
        rows.push({ i, rank: 0, j: -1, start: 0, lcp: 0, compares: 0 });
        continue;
      }
      const j = sa[rank[i] - 1];
      const start = h;
      let compares = 0;
      while (i + h < n && j + h < n) {
        compares += 1;
        if (text[i + h] !== text[j + h]) break;
        h += 1;
      }
      lcp[rank[i]] = h;
      rows.push({ i, rank: rank[i], j, start, lcp: h, compares });
      total += compares;
      if (h > 0) h -= 1;
    }
    return { lcp, rows, compares: total };
  };

  /* 이웃 쌍마다 처음부터 비교할 때의 글자 비교 수 */
  const naiveLcpCompares = (text, sa) => {
    const n = text.length;
    let total = 0;
    for (let j = 1; j < n; j++) {
      const a = sa[j - 1];
      const b = sa[j];
      for (let k = 0; a + k < n && b + k < n; k++) {
        total += 1;
        if (text[a + k] !== text[b + k]) break;
      }
    }
    return total;
  };

  /* 05_lrs의 무차별 대입. 모든 위치 쌍 i < j의 공통 접두사를 센다. */
  const bruteLrs = (text) => {
    const n = text.length;
    let best = 0;
    let at = [0, 0];
    let compares = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let k = 0;
        while (j + k < n) {
          compares += 1;
          if (text[i + k] !== text[j + k]) break;
          k += 1;
        }
        if (k > best) {
          best = k;
          at = [i, j];
        }
      }
    }
    return { best, at, compares, pairs: (n * (n - 1)) / 2 };
  };

  /* 참조 띠 채우기. rows: [{ label, values, cls }]. 칸마다 data-ss-i가 붙어 markStrip으로 칠한다. */
  const drawStrip = (el, text, rows = []) => {
    el.style.setProperty('--ss-cols', String(text.length));
    const cell = (i, v, cls = '') => `<span class="ss-cell ${cls}" data-ss-i="${i}">${v}</span>`;
    const label = (s) => `<span class="ss-label">${s}</span>`;
    const chars = [...text];
    let html = label(el.dataset.ssPos) + chars.map((_, i) => cell(i, i, 'ss-pos')).join('');
    html += label(el.dataset.ssChar) + chars.map((c, i) => cell(i, c, 'ss-ch')).join('');
    for (const r of rows) html += label(r.label) + r.values.map((v, i) => cell(i, v, r.cls || '')).join('');
    el.innerHTML = html;
  };
  /* marks: { 클래스: 위치 배열 }. is-now(주황), is-a(파랑), is-b(보라), is-hit(초록) */
  const markStrip = (el, marks = {}) => {
    el.querySelectorAll('[data-ss-i]').forEach((c) => {
      const i = Number(c.dataset.ssI);
      c.classList.remove('is-now', 'is-a', 'is-b', 'is-hit');
      for (const [cls, list] of Object.entries(marks)) if (list.includes(i)) c.classList.add(cls);
    });
  };

  /* 입력 다듬기: 끝 표시와 구분자로 쓰는 글자, 공백을 뺀다. */
  const cleanWord = (s, max) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, max);

  globalThis.aasSuffixAlgos = {
    buildSA, rankOf, kasai, naiveLcpCompares, bruteLrs, drawStrip, markStrip, cleanWord,
  };
})();
