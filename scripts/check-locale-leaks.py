#!/usr/bin/env python3
"""로케일 누수 검사 — 빌드 산출물에 다른 언어 문자가 남았는지 본다.

사용법 (repo 루트에서, `cd site && pnpm build` 뒤에):
    python3 scripts/check-locale-leaks.py site/dist/zh
    python3 scripts/check-locale-leaks.py site/dist/en

테마는 en·ko UI 문자열만 내장한다. 중국어처럼 사이트가 추가한 로케일에서
`site.ts`의 `ui.zh`·`pricingLabels`·`difficultyLabels`에 채우지 않은 키는
기본 로케일(한국어)로 떨어진다. 그것을 찾아낸다.

grep으로 하지 않는 이유: grep은 줄 단위라 텍스트 노드가 줄바꿈으로 끊기면
놓친다. `> 이름순\n<span>`이 그런 경우다. 여기서는 태그를 먼저 걷어낸 뒤
본문과 속성값(title·alt·aria-label 등)을 함께 본다.

`한국어`는 예외다. 언어 전환기에 표시되는 로케일 이름이라 남는 것이 맞다.
위반이 있으면 목록을 출력하고 종료 코드 1을 반환한다.
"""
import re, sys, pathlib, html

root = pathlib.Path(sys.argv[1])
HANGUL = re.compile(r'[가-힣]')
SCRIPT = re.compile(r'<(script|style)\b.*?</\1>', re.S | re.I)
TAG = re.compile(r'<[^>]+>', re.S)
ATTR = re.compile(r'(?:title|alt|aria-label|placeholder|content)="([^"]*)"')

found = {}
for f in root.rglob('*.html'):
    raw = f.read_text(encoding='utf-8', errors='ignore')
    for m in ATTR.findall(raw):
        v = html.unescape(m).strip()
        if HANGUL.search(v):
            found.setdefault(v, set()).add(f.name)
    body = html.unescape(TAG.sub(' ', SCRIPT.sub(' ', raw)))
    for chunk in re.split(r'\s{2,}|\n', body):
        c = chunk.strip()
        if c and HANGUL.search(c):
            found.setdefault(c, set()).add(f.name)

left = {k: v for k, v in found.items() if k != '한국어'}
if left:
    for k in sorted(left):
        print(f"  {k[:70]:<72} ({len(left[k])}개 파일)")
    sys.exit(1)
print("  깨끗함")
