// @ts-check
/**
 * `[[용어]]` 위키링크의 중앙 용어집. 본문 어디서든 `[[big-o]]`,
 * `[[big-o|Big-O]]`처럼 참조하면 빌드 시 해당 항목으로 링크된다. 등록되지 않은
 * 용어는 빌드가 실패한다(의도된 동작). 항목 형태:
 *  - { label, def }              — 정의만 있는 용어 (용어집 페이지에 표시)
 *  - { label, course: '<slug>' } — 강의 문서로 연결
 *  - { label, article: '<slug>' } — 글로 연결
 *  - { label, href }             — 외부 링크
 *
 * label과 def는 로케일별 레코드를 받는다. 키는 site.ts의 로케일 코드와 같다
 * (ko · en · zh). 빠진 로케일은 기본 로케일(ko)로 대체된다.
 *
 * 주제 자료를 만들면서 필요한 용어를 그때그때 추가한다. 여기 있는 것은
 * 과정 전체에서 반복해서 쓰이는 기본 용어다.
 */
export const glossary = {
  algorithm: {
    label: { ko: '알고리즘', en: 'Algorithm', zh: '算法' },
    def: {
      ko: '문제를 푸는 절차를 유한한 단계로 명확히 적은 것. 같은 입력에 같은 출력을 내고, 반드시 끝나야 한다.',
      en: 'A procedure for solving a problem, written out as a finite number of unambiguous steps. The same input yields the same output, and it must terminate.',
      zh: '把解决问题的步骤用有限且明确的步骤写下来。相同输入产生相同输出，并且必须终止。',
    },
  },
  'pseudo-code': {
    label: { ko: '의사코드', en: 'Pseudocode', zh: '伪代码' },
    def: {
      ko: '특정 언어의 문법에 매이지 않고 알고리즘의 절차만 적은 코드. 이 과정에서는 의사코드가 기준이고 C와 Python 구현은 그것을 옮긴 것이다.',
      en: 'Code that states only the procedure, free of any one language’s syntax. In this course the pseudocode is the reference and the C and Python versions are transcriptions of it.',
      zh: '不受具体语言语法约束、只写出算法步骤的代码。本课程以伪代码为基准，C 与 Python 实现都是它的转写。',
    },
  },
  'big-o': {
    label: { ko: 'Big-O', en: 'Big-O', zh: '大 O 表示法' },
    def: {
      ko: '입력 크기가 커질 때 실행 시간이나 메모리가 어떤 비율로 늘어나는지를 나타내는 점근 상한. 상수와 낮은 차수 항을 버리고 증가율만 남긴다.',
      en: 'An asymptotic upper bound on how running time or memory grows as the input grows. Constants and lower-order terms are dropped, leaving only the growth rate.',
      zh: '描述输入规模增大时运行时间或内存增长比例的渐近上界。舍去常数与低阶项，只保留增长率。',
    },
  },
  'asymptotic-analysis': {
    label: { ko: '점근 분석', en: 'Asymptotic analysis', zh: '渐近分析' },
    def: {
      ko: '입력이 충분히 커졌을 때의 동작만 따지는 분석. 하드웨어나 언어에 좌우되는 상수를 걷어내고 알고리즘 자체를 비교하기 위한 도구다.',
      en: 'Analysis that considers only what happens once the input is large enough. It strips away constants that depend on hardware or language so algorithms can be compared on their own terms.',
      zh: '只考察输入足够大时行为的分析方法。剥离依赖硬件与语言的常数，从而单纯比较算法本身。',
    },
  },
  'trade-off': {
    label: { ko: '트레이드오프', en: 'Trade-off', zh: '权衡' },
    def: {
      ko: '하나를 얻으면 다른 하나를 내주어야 하는 관계. 알고리즘 선택은 대개 최선을 고르는 일이 아니라 무엇을 내줄지 정하는 일이다.',
      en: 'A relation where gaining one thing costs another. Choosing an algorithm is usually less about picking the best one than about deciding what to give up.',
      zh: '得到一样就要放弃另一样的关系。选择算法通常不是挑出最好的那个，而是决定放弃什么。',
    },
  },
  'sequential-search': {
    label: { ko: '순차 검색', en: 'Sequential search', zh: '顺序查找' },
    def: {
      ko: '배열을 앞에서부터 하나씩 비교해 찾는 검색. 정렬 여부와 무관하게 쓸 수 있고, 최악에는 n번 비교한다.',
      en: 'Searching by comparing elements from the front, one at a time. It works whether or not the array is sorted, and compares n times in the worst case.',
      zh: '从头开始逐个比较进行查找。无论数组是否有序都能使用，最坏情况下比较 n 次。',
    },
  },
  'binary-search': {
    label: { ko: '이진 검색', en: 'Binary search', zh: '二分查找' },
    def: {
      ko: '정렬된 배열에서 가운데와 비교해 남은 범위를 절반씩 줄여 가는 검색. 비교 한 번에 후보가 반으로 줄어 O(log n)이다.',
      en: 'Searching a sorted array by comparing with the middle and halving the remaining range. Each comparison halves the candidates, giving O(log n).',
      zh: '在有序数组中与中间元素比较、每次将剩余范围减半的查找。每比较一次候选就减半，因此是 O(log n)。',
    },
  },
  'time-complexity': {
    label: { ko: '시간 복잡도', en: 'Time complexity', zh: '时间复杂度' },
    def: {
      ko: '입력 크기에 대한 연산 횟수의 증가율. 실제 초 단위 시간이 아니라 비교·이동 같은 기본 연산의 개수를 센다.',
      en: 'How the number of operations grows with the input size. It counts basic operations such as comparisons and moves, not wall-clock seconds.',
      zh: '运算次数随输入规模的增长率。计数的是比较、移动等基本操作，而不是实际的秒数。',
    },
  },
  'space-complexity': {
    label: { ko: '공간 복잡도', en: 'Space complexity', zh: '空间复杂度' },
    def: {
      ko: '입력 크기에 대해 추가로 필요한 메모리의 증가율. 제자리 정렬과 그렇지 않은 정렬을 가르는 기준이다.',
      en: 'How the extra memory required grows with the input size. It is what separates an in-place sort from one that is not.',
      zh: '额外所需内存随输入规模的增长率。它区分了原地排序与非原地排序。',
    },
  },
  'divide-and-conquer': {
    label: { ko: '분할 정복', en: 'Divide and conquer', zh: '分治法' },
    def: {
      ko: '문제를 같은 형태의 작은 문제로 쪼개고, 각각을 풀고, 결과를 합치는 설계 전략. 머지 정렬과 퀵 정렬이 대표적이다.',
      en: 'A design strategy that splits a problem into smaller problems of the same shape, solves each, and combines the results. Merge sort and quicksort are the classic examples.',
      zh: '把问题拆成同样形态的小问题，分别求解后再合并结果的设计策略。归并排序与快速排序是典型代表。',
    },
  },
  recursion: {
    label: { ko: '재귀', en: 'Recursion', zh: '递归' },
    def: {
      ko: '함수가 자기 자신을 부르며 문제를 줄여 가는 방식. 종료 조건과 축소 단계가 있어야 끝난다.',
      en: 'A function calling itself to shrink the problem. It terminates only if there is a base case and each call makes the problem smaller.',
      zh: '函数调用自身以缩小问题的方式。必须有终止条件和缩减步骤才能结束。',
    },
  },
  'stable-sort': {
    label: { ko: '안정 정렬', en: 'Stable sort', zh: '稳定排序' },
    def: {
      ko: '같은 값을 가진 원소들의 원래 순서가 정렬 후에도 유지되는 정렬. 여러 기준으로 연달아 정렬할 때 의미가 생긴다.',
      en: 'A sort that keeps equal elements in their original relative order. It matters when you sort by several keys in succession.',
      zh: '排序后相同元素仍保持原有相对顺序的排序。在按多个关键字连续排序时才显出意义。',
    },
  },
  'in-place': {
    label: { ko: '제자리', en: 'In-place', zh: '原地' },
    def: {
      ko: '입력 배열 바깥에 크기가 입력에 비례하는 추가 공간을 쓰지 않는 성질. 퀵 정렬은 제자리지만 머지 정렬은 아니다.',
      en: 'Using no extra space proportional to the input beyond the input array itself. Quicksort is in-place; merge sort is not.',
      zh: '除输入数组外不使用与输入规模成正比的额外空间。快速排序是原地的，归并排序不是。',
    },
  },
  pivot: {
    label: { ko: '피벗', en: 'Pivot', zh: '基准元素' },
    def: {
      ko: '퀵 정렬에서 배열을 두 덩어리로 가르는 기준값. 어떻게 고르느냐가 최악의 경우를 만드느냐 피하느냐를 결정한다.',
      en: 'The value quicksort splits the array around. How you choose it decides whether you hit the worst case or avoid it.',
      zh: '快速排序中把数组分成两部分的基准值。如何选择它决定了是否会落入最坏情况。',
    },
  },
  'greedy-algorithm': {
    label: { ko: '그리디 알고리즘', en: 'Greedy algorithm', zh: '贪心算法' },
    def: {
      ko: '매 단계에서 그 순간 가장 좋아 보이는 선택을 하고 되돌리지 않는 방식. 문제가 조건을 만족할 때만 전체 최적해가 보장된다.',
      en: 'Taking whatever looks best at each step and never backtracking. It reaches a global optimum only when the problem has the right structure.',
      zh: '每一步都选当下看起来最好的选项且不回溯。只有当问题满足特定性质时才能保证全局最优。',
    },
  },
  'dynamic-programming': {
    label: { ko: '동적 계획법', en: 'Dynamic programming', zh: '动态规划' },
    def: {
      ko: '겹치는 부분 문제의 답을 한 번만 계산하고 저장해 재사용하는 방식. 지수 시간으로 부풀던 재귀를 다항 시간으로 되돌린다.',
      en: 'Computing each overlapping subproblem once, storing the answer and reusing it. It brings a recursion that had blown up exponentially back into polynomial time.',
      zh: '把重叠子问题只计算一次并保存复用的方法。让原本指数级膨胀的递归回到多项式时间。',
    },
  },
  memoization: {
    label: { ko: '메모이제이션', en: 'Memoization', zh: '记忆化' },
    def: {
      ko: '재귀를 그대로 두고 이미 계산한 부분 문제의 답을 캐시에 담아 두는 하향식 동적 계획법.',
      en: 'Top-down dynamic programming: keep the recursion and cache the answers to subproblems already solved.',
      zh: '自顶向下的动态规划：保留递归结构，把已算出的子问题答案缓存起来。',
    },
  },
  tabulation: {
    label: { ko: '타뷸레이션', en: 'Tabulation', zh: '递推填表' },
    def: {
      ko: '작은 부분 문제부터 표를 채워 올라가는 상향식 동적 계획법. 재귀 호출 비용이 없다.',
      en: 'Bottom-up dynamic programming: fill a table starting from the smallest subproblems. There is no recursive call overhead.',
      zh: '自底向上的动态规划：从最小子问题开始填表。没有递归调用的开销。',
    },
  },
  'hash-function': {
    label: { ko: '해시 함수', en: 'Hash function', zh: '哈希函数' },
    def: {
      ko: '임의의 키를 정해진 범위의 정수로 바꾸는 함수. 그 정수가 배열의 인덱스가 된다.',
      en: 'A function turning an arbitrary key into an integer in a fixed range. That integer becomes an array index.',
      zh: '把任意键转换为固定范围内整数的函数。该整数即数组下标。',
    },
  },
  collision: {
    label: { ko: '충돌', en: 'Collision', zh: '冲突' },
    def: {
      ko: '서로 다른 키가 같은 해시값을 갖는 상황. 해시 테이블 설계의 절반은 충돌을 어떻게 다루느냐다.',
      en: 'Two different keys hashing to the same value. Half of hash table design is deciding how to handle it.',
      zh: '不同的键得到相同哈希值的情况。哈希表设计有一半就在于如何处理冲突。',
    },
  },
  bst: {
    label: { ko: '이진 탐색 트리', en: 'Binary search tree', zh: '二叉搜索树' },
    def: {
      ko: '왼쪽 서브트리의 모든 키가 자기보다 작고 오른쪽이 자기보다 큰 이진 트리. 균형이 무너지면 탐색이 리스트처럼 느려진다.',
      en: 'A binary tree where every key in the left subtree is smaller and every key on the right is larger. Once balance is lost, search degrades to list speed.',
      zh: '左子树所有键都小于自身、右子树都大于自身的二叉树。一旦失衡，查找就退化到与链表相当。',
    },
  },
  trie: {
    label: { ko: '트라이', en: 'Trie', zh: '字典树' },
    def: {
      ko: '문자열을 문자 단위로 쪼개 경로로 저장하는 트리. 접두사를 공유하므로 접두사 검색이 자연스럽다.',
      en: 'A tree that stores strings character by character along paths. Shared prefixes make prefix search natural.',
      zh: '把字符串按字符拆开、沿路径存储的树。共享前缀使前缀查找变得自然。',
    },
  },
  graph: {
    label: { ko: '그래프', en: 'Graph', zh: '图' },
    def: {
      ko: '정점과 그 사이를 잇는 간선으로 이루어진 자료구조. 지도, 소셜 관계, 의존성이 모두 그래프로 표현된다.',
      en: 'A structure of vertices and the edges connecting them. Maps, social ties and dependencies are all graphs.',
      zh: '由顶点与连接顶点的边构成的数据结构。地图、社交关系、依赖关系都可用图表示。',
    },
  },
  bfs: {
    label: { ko: 'BFS', en: 'BFS', zh: '广度优先搜索' },
    def: {
      ko: '시작점에서 가까운 정점부터 층별로 훑는 그래프 탐색. 가중치가 없는 그래프에서는 이것만으로 최단 경로가 나온다.',
      en: 'Graph traversal that sweeps outward from the start one layer at a time. On an unweighted graph it already gives the shortest path.',
      zh: '从起点逐层向外遍历的图搜索。在无权图上，仅凭它就能得到最短路径。',
    },
  },
  dfs: {
    label: { ko: 'DFS', en: 'DFS', zh: '深度优先搜索' },
    def: {
      ko: '한 방향으로 갈 수 있는 데까지 들어갔다가 막히면 되돌아 나오는 그래프 탐색.',
      en: 'Graph traversal that goes as deep as it can in one direction, then backtracks when it is stuck.',
      zh: '沿一个方向尽可能深入、走不通时再回溯的图搜索。',
    },
  },
  mst: {
    label: { ko: '최소 스패닝 트리', en: 'Minimum spanning tree', zh: '最小生成树' },
    def: {
      ko: '모든 정점을 사이클 없이 잇는 부분 그래프 중 간선 가중치의 합이 가장 작은 것.',
      en: 'Among the subgraphs connecting every vertex without a cycle, the one whose edge weights sum to the least.',
      zh: '在无环地连接所有顶点的子图中，边权之和最小的那一个。',
    },
  },
  'shortest-path': {
    label: { ko: '최단 경로', en: 'Shortest path', zh: '最短路径' },
    def: {
      ko: '두 정점을 잇는 경로 중 가중치의 합이 가장 작은 경로. 간선 가중치가 음수이면 Dijkstra는 쓸 수 없다.',
      en: 'The path between two vertices whose weights sum to the least. Dijkstra cannot be used once an edge weight is negative.',
      zh: '连接两个顶点的路径中权重之和最小的一条。若存在负权边，就不能使用 Dijkstra。',
    },
  },
  'priority-queue': {
    label: { ko: '우선순위 큐', en: 'Priority queue', zh: '优先队列' },
    def: {
      ko: '넣은 순서가 아니라 우선순위가 가장 높은 원소가 먼저 나오는 큐. 보통 힙으로 구현한다.',
      en: 'A queue that hands back the highest-priority element rather than the one inserted first. Usually implemented with a heap.',
      zh: '不按入队顺序、而是优先级最高的元素先出的队列。通常用堆实现。',
    },
  },
};
