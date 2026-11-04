// 주제 10의 데모가 함께 쓰는 트라이와 TST 구현.
//
// 절차는 algorithm-code의 topic-10-trie(01_trie, 02_tst)와 같다. 컴포넌트가 이 파일을
// ?raw로 읽어 is:inline으로 넣는다. 트라이 노드의 id는 루트에서 그 노드까지의 문자열
// (루트는 ''), TST 노드의 id는 루트에서 간 방향 L·M·R의 문자열(루트는 '')이다.
(() => {
  if (globalThis.aasTrieAlgos) return;

  /* 트라이 */
  const newTrie = () => new Map([['', { id: '', ch: '', parent: null, kids: [], value: null }]]);
  function addKid(trie, parentId, ch) {
    const nid = parentId + ch;
    trie.set(nid, { id: nid, ch, parent: parentId, kids: [], value: null });
    const kids = trie.get(parentId).kids;
    kids.push(nid);
    kids.sort();
    return nid;
  }
  /* 있는 노드는 지나가고, 없으면 만든다. 지나간 것과 만든 것을 돌려준다. */
  function trieInsert(trie, word, value) {
    let cur = '';
    const passed = [];
    const made = [];
    for (const ch of word) {
      const next = cur + ch;
      if (trie.has(next)) passed.push(next);
      else made.push(addKid(trie, cur, ch));
      cur = next;
    }
    trie.get(cur).value = value;
    return { passed, made };
  }
  const buildTrie = (pairs) => {
    const trie = newTrie();
    pairs.forEach(([w, v]) => trieInsert(trie, w, v));
    return trie;
  };
  /* 자리: 잎은 한 칸씩, 부모는 첫 자식과 마지막 자식의 가운데 */
  function layoutTrie(trie, unit, level) {
    const pos = new Map();
    let slot = 0;
    let depth = 0;
    (function place(nid, d) {
      const n = trie.get(nid);
      depth = Math.max(depth, d);
      if (n.kids.length === 0) {
        pos.set(nid, { x: slot * unit, y: d * level });
        slot += 1;
        return;
      }
      n.kids.forEach((k) => place(k, d + 1));
      const a = pos.get(n.kids[0]);
      const b = pos.get(n.kids[n.kids.length - 1]);
      pos.set(nid, { x: (a.x + b.x) / 2, y: d * level });
    })('', 0);
    return { pos, slots: slot, depth };
  }

  /* TST */
  /* 키 하나를 넣으며 비교 한 번마다 기록을 남긴다. kind: less · greater · equal · last */
  function tstInsert(tst, word, value) {
    const log = [];
    let nid = '';
    let index = 0;
    while (tst.has(nid)) {
      const n = tst.get(nid);
      const c = word[index];
      if (c < n.ch) {
        log.push({ nid, kind: 'less', c, d: n.ch, index });
        nid += 'L';
      } else if (c > n.ch) {
        log.push({ nid, kind: 'greater', c, d: n.ch, index });
        nid += 'R';
      } else if (index < word.length - 1) {
        log.push({ nid, kind: 'equal', c, d: n.ch, index });
        nid += 'M';
        index += 1;
      } else {
        log.push({ nid, kind: 'last', c, d: n.ch, index });
        n.value = value;
        return { log, made: [], rest: '', index };
      }
    }
    /* 자리가 비었다: 남은 문자를 가운데로 줄줄이 */
    const made = [];
    for (let i = index; i < word.length; i++) {
      tst.set(nid, { id: nid, ch: word[i], value: null, path: word.slice(0, i + 1) });
      made.push(nid);
      if (i < word.length - 1) nid += 'M';
    }
    tst.get(nid).value = value;
    return { log, made, rest: word.slice(index), index };
  }
  const buildTst = (pairs) => {
    const tst = new Map();
    pairs.forEach(([w, v]) => tstInsert(tst, w, v));
    return tst;
  };
  /* getNode: 비교 한 번마다 기록. 찾으면 node, 못 찾으면 null */
  function tstWalk(tst, word) {
    const log = [];
    let nid = '';
    let index = 0;
    while (tst.has(nid)) {
      const n = tst.get(nid);
      const c = word[index];
      if (c < n.ch) {
        log.push({ nid, kind: 'less', c, d: n.ch, index });
        nid += 'L';
      } else if (c > n.ch) {
        log.push({ nid, kind: 'greater', c, d: n.ch, index });
        nid += 'R';
      } else if (index === word.length - 1) {
        log.push({ nid, kind: 'last', c, d: n.ch, index });
        return { log, node: nid };
      } else {
        log.push({ nid, kind: 'equal', c, d: n.ch, index });
        nid += 'M';
        index += 1;
      }
    }
    return { log, node: null };
  }
  /* 높이: 루트에서 가장 먼 노드까지 거치는 노드 수 (실습 코드의 height) */
  const tstHeight = (tst) => {
    const h = (nid) => (tst.has(nid) ? 1 + Math.max(h(nid + 'L'), h(nid + 'M'), h(nid + 'R')) : 0);
    return h('');
  };
  /* 자리: 왼쪽 서브트리, 자기(가운데 자식 바로 위), 오른쪽 서브트리 순서로 칸을 쓴다. */
  function layoutTst(tst, unit, level) {
    const pos = new Map();
    let slot = 0;
    let depth = 0;
    (function place(nid, d) {
      if (!tst.has(nid)) return;
      depth = Math.max(depth, d);
      place(nid + 'L', d + 1);
      if (tst.has(nid + 'M')) {
        place(nid + 'M', d + 1);
        pos.set(nid, { x: pos.get(nid + 'M').x, y: d * level });
      } else {
        pos.set(nid, { x: slot * unit, y: d * level });
        slot += 1;
      }
      place(nid + 'R', d + 1);
    })('', 0);
    return { pos, slots: slot, depth };
  }

  /* 실습 코드의 next_random과 같은 수열 */
  function makeRandom(start) {
    let seed = start;
    return () => {
      seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
      return seed >> 16;
    };
  }

  /* 입력창의 글자를 키로: 소문자 a-z만 남기고, 같은 키는 하나만 */
  const cleanWords = (raw) => [
    ...new Set(
      String(raw)
        .toLowerCase()
        .split(/[^a-z]+/)
        .filter(Boolean),
    ),
  ];

  globalThis.aasTrieAlgos = {
    newTrie,
    trieInsert,
    buildTrie,
    layoutTrie,
    tstInsert,
    buildTst,
    tstWalk,
    tstHeight,
    layoutTst,
    makeRandom,
    cleanWords,
  };
})();
