// 주제 13의 데모가 함께 쓰는 NFA 절차.
//
// build는 algorithm-code의 nfaRegex.c · nfa_regex.py와 같은 순서로 ε 전이를 만든다.
// 괄호 한 쌍에 '|'가 여럿이어도 되도록 ')'에서 '|'를 모두 꺼내는 것만 다르고, '|'가
// 하나면 실습 코드와 같은 그래프다. 전이마다 어느 규칙이 만들었는지도 적어 둔다.
// RegexCore.astro가 이 파일을 ?raw로 읽어 is:inline으로 넣는다.
(() => {
  if (globalThis.aasRegexCore) return;

  const isLiteral = (c) => !'()*|'.includes(c);

  /* 이 데모들이 받는 문법인지 본다. 아니면 오류 문구의 열쇠를 돌려준다. */
  function validate(re) {
    if (!/^[A-Za-z0-9 .*|()]*$/.test(re)) return 'errChar';
    let depth = 0;
    for (let i = 0; i < re.length; i++) {
      const c = re[i];
      if (c === '(') depth += 1;
      else if (c === ')') {
        depth -= 1;
        if (depth < 0) return 'errParen';
      } else if (c === '*' && (i === 0 || '(|*'.includes(re[i - 1]))) return 'errStar';
    }
    return depth === 0 ? null : 'errParen';
  }

  /* BuildNFA. eps는 실습 코드가 더하는 순서 그대로이고, rules는 전이의 출처다.
     rule: sym '(' ')' '*'에서 다음으로, star0 덩어리를 0번, star1 한 번 더,
     orB '('에서 오른쪽 갈래로, orEnd '|'에서 ')'로 */
  function build(regex) {
    const re = `(${regex})`;
    const M = re.length;
    const eps = [];
    const rules = [];
    const add = (a, b, rule) => {
      eps.push([a, b]);
      rules.push(rule);
    };
    const ops = [];
    for (let i = 0; i < M; i++) {
      let lp = i;
      if (re[i] === '(' || re[i] === '|') ops.push(i);
      else if (re[i] === ')') {
        const ors = [];
        let top = ops.pop();
        while (re[top] === '|') {
          ors.push(top);
          top = ops.pop();
        }
        lp = top;
        for (const or of ors) {
          add(lp, or + 1, 'orB');
          add(or, i, 'orEnd');
        }
      }
      if (i < M - 1 && re[i + 1] === '*') {
        add(lp, i + 1, 'star0');
        add(i + 1, lp, 'star1');
      }
      if (re[i] === '(' || re[i] === '*' || re[i] === ')') add(i, i + 1, 'sym');
    }
    const adj = Array.from({ length: M + 1 }, () => []);
    eps.forEach(([a, b]) => adj[a].push(b));
    return { regex, re, M, eps, rules, adj };
  }

  /* Closure. 실습 코드의 dfs와 같은 순서로 돈다. onEvent를 주면 걸음마다 알린다.
     work는 집합에 넣은 상태 수다. */
  function closure(g, seed, onEvent) {
    const out = new Set();
    let work = 0;
    const dfs = (v, from) => {
      out.add(v);
      work += 1;
      if (onEvent) onEvent({ kind: 'mark', v, from });
      for (const w of g.adj[v]) {
        if (!out.has(w)) dfs(w, v);
        else if (onEvent) onEvent({ kind: 'skip', v, w });
      }
      if (onEvent) onEvent({ kind: 'leave', v });
    };
    for (let v = 0; v <= g.M; v++) if (seed.has(v) && !out.has(v)) dfs(v, null);
    return { set: out, work };
  }

  /* 글자 하나를 읽고 한 칸 앞으로 간 상태들 */
  function readChar(g, pc, ch) {
    const match = new Set();
    const from = [];
    for (let i = 0; i < g.M; i++) {
      if (pc.has(i) && isLiteral(g.re[i]) && (g.re[i] === ch || g.re[i] === '.')) {
        match.add(i + 1);
        from.push(i);
      }
    }
    return { match, from };
  }

  /* Recognizes. 글자마다 집합과 작업량을 돌려준다. */
  function run(g, text) {
    const first = closure(g, new Set([0]));
    let pc = first.set;
    let work = first.work;
    const trail = [{ set: pc }];
    for (const ch of text) {
      const { match, from } = readChar(g, pc, ch);
      const c = closure(g, match);
      pc = c.set;
      work += c.work;
      trail.push({ ch, match, from, set: pc });
    }
    return { ok: pc.has(g.M), work, trail };
  }

  const show = (set) => `{${[...set].sort((a, b) => a - b).join(' ')}}`;

  /* 그림. 상태를 한 줄로 두고, 이웃으로 가는 전이는 직선, 나머지 ε 전이는 앞으로 가면
     위로, 뒤로 가면 아래로 도는 호다. NfaDemo의 그림과 같은 규칙이다. */
  function svg(g, id, label) {
    const U = 46;
    const R = 15;
    const PAD = 26;
    const { re, M, eps } = g;
    const hOf = (v, w) => 18 + Math.abs(w - v) * 7.5;
    const seen = new Set();
    const arcs = eps.filter(([v, w]) => {
      const key = `${v}-${w}`;
      if (seen.has(key) || (w === v + 1 && !isLiteral(re[v]))) return false;
      seen.add(key);
      return true;
    });
    const upH = Math.max(30, ...arcs.filter(([v, w]) => w > v).map(([v, w]) => hOf(v, w)));
    const downH = Math.max(30, ...arcs.filter(([v, w]) => w < v).map(([v, w]) => hOf(v, w)));
    const Y = upH + 18;
    const W = 2 * PAD + M * U;
    const H = Y + downH + 26;
    const X = (i) => PAD + i * U;
    const arcPath = (v, w) => {
      const up = w > v;
      const sx = X(v) + (up ? 4 : -4);
      const ex = X(w) + (up ? -4 : 4);
      const sy = Y + (up ? -R : R);
      const ey = Y + (up ? -R - 1 : R + 1);
      const c = (up ? -1 : 1) * hOf(v, w) * 1.3;
      return `M ${sx} ${sy} C ${sx} ${sy + c}, ${ex} ${ey + c}, ${ex} ${ey}`;
    };
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    let body = '';
    const edge = (key, d, kind) => {
      body += `<path class="ng-hit" d="${d}" data-ng-edge="${key}"/>`;
      body += `<path class="ng-edge is-${kind}" d="${d}" data-ng-line="${key}" marker-end="url(#${id}-${kind})"/>`;
    };
    for (let i = 0; i < M; i++) {
      if (re[i] === '|') continue;
      const lit = isLiteral(re[i]);
      edge(lit ? `m${i}` : `e${i}-${i + 1}`, `M ${X(i) + R} ${Y} L ${X(i + 1) - R - 2} ${Y}`, lit ? 'match' : 'eps');
    }
    for (const [v, w] of arcs) edge(`e${v}-${w}`, arcPath(v, w), 'eps');
    for (let i = 0; i <= M; i++) {
      body += `<g class="ng-state${i === M ? ' is-final' : ''}" data-ng-state="${i}">`;
      if (i === M) body += `<circle class="ng-ring" cx="${X(i)}" cy="${Y}" r="${R + 4}"/>`;
      body += `<circle cx="${X(i)}" cy="${Y}" r="${R}"/>`;
      body += `<text class="ng-char" x="${X(i)}" y="${Y}">${i < M ? esc(re[i] === ' ' ? '␣' : re[i]) : ''}</text>`;
      body += `<text class="ng-num" x="${X(i) + R - 2}" y="${Y + R + 12}">${i}</text></g>`;
    }
    const marker = (name, cls) =>
      `<marker id="${id}-${name}" class="${cls}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker>`;
    return (
      `<svg class="ng-graph" viewBox="0 0 ${W} ${H}" style="max-width:${Math.round(W * 1.25)}px" role="img" aria-label="${esc(label)}">` +
      `<defs>${marker('match', 'ng-tip-match')}${marker('eps', 'ng-tip-eps')}${marker('on', 'ng-tip-on')}</defs>${body}</svg>`
    );
  }

  /* 전이의 칠을 바꾼다. 화살촉도 함께 바꿔야 해서 여기에 둔다. */
  function paintEdge(root, id, key, on) {
    const line = root.querySelector(`[data-ng-line="${key}"]`);
    if (!line) return;
    line.classList.toggle('is-on', on);
    const kind = key[0] === 'm' ? 'match' : 'eps';
    line.setAttribute('marker-end', `url(#${id}-${on ? 'on' : kind})`);
  }

  globalThis.aasRegexCore = { isLiteral, validate, build, closure, readChar, run, show, svg, paintEdge };
})();
