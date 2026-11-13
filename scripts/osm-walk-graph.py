#!/usr/bin/env python3
"""OpenStreetMap 보행 도로망을 길찾기 데모용 그래프로 바꾼다.

입력은 Overpass API가 돌려준 JSON(도로 way와 그 node, 이름 붙은 역·건물)이다.
출력은 site/src/data/의 JSON이며 MapRouteDemo가 읽는다.

  - 정점은 교차로와 길의 끝이다. 두 교차로 사이의 길 한 토막이 간선이고, 가중치는
    그 토막의 실제 길이(m)다. 간선마다 그릴 때 쓸 꺾인 선(폴리라인)을 함께 둔다.
  - 실내 통로(corridor)와 주차장 안 통로(parking_aisle)는 뺀다.
  - 상자(bbox) 밖의 점에서 길을 끊고, 가장 큰 연결 요소만 남긴다.
  - 간선마다 길의 등급(2 큰길, 1 골목·차로, 0 보행로·계단)을 둔다. 그릴 때만 쓴다.
  - 좌표는 상자의 왼쪽 위를 원점으로 하는 미터 단위 평면으로 바꾼다(위도 1도 110,540m,
    경도 1도 111,320m x cos 위도). 저장할 때는 0.1m 단위 정수로 줄인다.

지도 데이터: © OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright)

사용법:
  python3 scripts/osm-walk-graph.py songdo raw.json site/src/data/map-songdo.json

첫 인자는 아래 AREAS의 지역 이름이다. raw.json을 받는 Overpass 질의(상자는 AREAS의 bbox):
  [out:json];(
    way["highway"~"^(primary|secondary|tertiary|unclassified|residential|living_street|
      pedestrian|footway|path|steps|service|primary_link|secondary_link|tertiary_link|
      track|corridor|cycleway)$"](bbox);
    node["railway"="station"](bbox);
    way["name"]["building"](bbox);
  );out body;>;out skel qt;
"""
import json
import math
import sys

# 지역마다 상자(남, 서, 북, 동)와 랜드마크를 둔다. 랜드마크는 키 -> (종류, OSM 이름, 고를 좌표)다.
# 같은 이름이 여럿이면(역은 노선마다 하나씩) 고를 좌표에 가장 가까운 것을 쓴다.
AREAS = {
    # 연세대학교 국제캠퍼스(송도)와 인천 1호선 캠퍼스타운역·테크노파크역
    'songdo': {
        'bbox': (37.3725, 126.6530, 37.3920, 126.6830),
        'marks': {
            'campusTown': ('node', '캠퍼스타운', None),
            'technopark': ('node', '테크노파크', None),
            'library': ('way', '언더우드 기념도서관', None),
            'mainHall': ('way', '종합관', None),
            'dormA': ('way', '송도학사 A', None),
            'dormE': ('way', '송도학사 E', None),
        },
    },
}

S = W = N = E = 0.0
KX = KY = 1.0
LANDMARKS = {}


def set_area(name):
    global S, W, N, E, KX, KY, LANDMARKS
    area = AREAS[name]
    S, W, N, E = area['bbox']
    KX = 111320 * math.cos(math.radians((S + N) / 2))
    KY = 110540
    LANDMARKS = area['marks']


# 길의 등급: 2는 큰길, 1은 골목·차로, 0은 보행로·계단. 그릴 때 굵기만 다르고 길이는 같게 센다.
KIND = {'primary': 2, 'secondary': 2, 'tertiary': 2, 'primary_link': 2, 'secondary_link': 2, 'tertiary_link': 2,
        'footway': 0, 'path': 0, 'steps': 0, 'pedestrian': 0, 'track': 0, 'cycleway': 0}


def proj(lat, lon):
    return ((lon - W) * KX, (N - lat) * KY)


def inside(lat, lon):
    return S <= lat <= N and W <= lon <= E


def rdp(pts, eps):
    """Ramer-Douglas-Peucker: 양 끝은 남기고, 직선에서 eps(m)보다 먼 점만 남긴다."""
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1e-9
    best, idx = -1, 0
    for i in range(1, len(pts) - 1):
        x, y = pts[i]
        d = abs(dy * (x - x1) - dx * (y - y1)) / L
        if d > best:
            best, idx = d, i
    if best <= eps:
        return [pts[0], pts[-1]]
    return rdp(pts[: idx + 1], eps)[:-1] + rdp(pts[idx:], eps)


def main(area, src, dst):
    set_area(area)
    els = json.load(open(src))['elements']
    node = {e['id']: (e['lat'], e['lon']) for e in els if e['type'] == 'node' and 'lat' in e}
    ways = []
    for e in els:
        t = e.get('tags', {})
        if e['type'] != 'way' or 'highway' not in t:
            continue
        if t['highway'] == 'corridor' or t.get('service') == 'parking_aisle' or t.get('indoor') == 'yes':
            continue
        if t.get('access') in ('private', 'no') or t.get('foot') == 'no':
            continue
        kind = KIND.get(t['highway'], 1)
        # 상자 밖의 점에서 끊는다.
        run = []
        for nid in e['nodes']:
            if nid in node and inside(*node[nid]):
                run.append(nid)
            else:
                if len(run) >= 2:
                    ways.append((run, kind))
                run = []
        if len(run) >= 2:
            ways.append((run, kind))

    # 교차로: 두 길 이상이 쓰거나 길의 끝인 점
    use = {}
    for w, _ in ways:
        for i, nid in enumerate(w):
            use[nid] = use.get(nid, 0) + (2 if i in (0, len(w) - 1) else 1)
    is_vertex = {nid for nid, c in use.items() if c >= 2}

    vid = {}
    edges = []  # (a, b, length, kind, polyline)
    for w, kind in ways:
        start = 0
        for i in range(1, len(w)):
            if w[i] in is_vertex:
                seg = w[start : i + 1]
                pts = [proj(*node[n]) for n in seg]
                length = sum(math.dist(pts[k], pts[k + 1]) for k in range(len(pts) - 1))
                a, b = seg[0], seg[-1]
                if a != b and length > 0:
                    for n in (a, b):
                        vid.setdefault(n, len(vid))
                    edges.append((vid[a], vid[b], length, kind, rdp(pts, 1.5)))
                start = i

    # 같은 두 정점을 잇는 간선은 가장 짧은 것만 남긴다.
    best = {}
    for a, b, length, kind, pts in edges:
        key = (min(a, b), max(a, b))
        if key not in best or length < best[key][2]:
            best[key] = (a, b, length, kind, pts)
    edges = list(best.values())

    # 가장 큰 연결 요소
    V = len(vid)
    adj = [[] for _ in range(V)]
    for a, b, *_ in edges:
        adj[a].append(b)
        adj[b].append(a)
    comp = [-1] * V
    sizes = []
    for s in range(V):
        if comp[s] >= 0:
            continue
        comp[s] = len(sizes)
        stack, size = [s], 0
        while stack:
            u = stack.pop()
            size += 1
            for v in adj[u]:
                if comp[v] < 0:
                    comp[v] = comp[s]
                    stack.append(v)
        sizes.append(size)
    big = max(range(len(sizes)), key=lambda c: sizes[c])
    keep = [v for v in range(V) if comp[v] == big]
    new = {v: i for i, v in enumerate(keep)}
    osm_of = {i: n for n, i in vid.items()}

    xy = [proj(*node[osm_of[v]]) for v in keep]
    out_edges = []
    for a, b, length, kind, pts in edges:
        if a in new and b in new:
            inner = [round(c * 10) for p in pts[1:-1] for c in p]
            out_edges.append([new[a], new[b], round(length * 10), kind, *inner])

    # 랜드마크는 가장 가까운 정점에 붙인다.
    def centroid(way_name):
        for e in els:
            if e['type'] == 'way' and e.get('tags', {}).get('name') == way_name:
                pts = [node[n] for n in e['nodes'] if n in node]
                return (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))
        raise SystemExit(f'not found: {way_name}')

    marks = {}
    for key, (kind, name, at) in LANDMARKS.items():
        if kind == 'node':
            cands = [(e['lat'], e['lon']) for e in els if e['type'] == 'node' and e.get('tags', {}).get('name') == name]
            lat, lon = min(cands, key=lambda p: math.dist(p, at)) if at else cands[0]
        else:
            lat, lon = centroid(name)
        x, y = proj(lat, lon)
        v = min(range(len(xy)), key=lambda i: math.dist(xy[i], (x, y)))
        marks[key] = {'x': round(x * 10), 'y': round(y * 10), 'v': v}

    data = {
        'source': '© OpenStreetMap contributors, ODbL 1.0',
        'bbox': [S, W, N, E],
        'width': round((E - W) * KX * 10),
        'height': round((N - S) * KY * 10),
        'xy': [round(c * 10) for p in xy for c in p],
        'edges': out_edges,
        'marks': marks,
    }
    with open(dst, 'w') as f:
        json.dump(data, f, separators=(',', ':'))
    print(f'V = {len(keep)}, E = {len(out_edges)}, largest component of {len(sizes)}, {sum(len(e) for e in out_edges)} numbers')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3])
