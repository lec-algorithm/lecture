#!/usr/bin/env python3
"""빌드 산출물에서 강조 마커(**)가 글자로 노출된 곳을 찾는다.

닫는 **가 구두점(。·수식 등) 뒤, 글자 앞에 끼면 CommonMark 강조가 닫히지
못하고 **가 본문에 그대로 찍힌다. 소스만 봐서는 여는 **와 닫는 **를
구별하기 어려우므로, 렌더된 HTML의 텍스트 노드를 검사한다.

사용: python3 scripts/check-bold-leaks.py site/dist
"""
import html
import pathlib
import re
import sys


def text_of(path: pathlib.Path) -> str:
    s = path.read_text(errors="ignore")
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", s, flags=re.S)
    return html.unescape(re.sub(r"<[^>]+>", " ", s))


def main() -> int:
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "site/dist")
    bad = 0
    for f in sorted(root.rglob("*.html")):
        text = re.sub(r"\s+", " ", text_of(f))
        for m in re.finditer(r".{,30}\*\*.{,30}", text):
            print(f"{f.relative_to(root)}: …{m.group(0)}…")
            bad += 1
    if bad:
        print(f"check-bold-leaks: 노출 {bad}건")
        return 1
    print("check-bold-leaks: 깨끗함")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
