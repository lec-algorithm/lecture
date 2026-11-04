// 주제 15의 예제 데이터. 데모가 다른 슬라이드를 보지 않아도 되게 한곳에 둔다.
//
// 평점과 장르는 algorithm-code의 collaborativeFiltering.c ·
// contentBasedFiltering.c와 같다. 평점 0은 아직 안 본 칸이다. M7은 아무도
// 평가하지 않은 새 영화라 평점 행렬에는 없고 장르만 있다.

/** 사용자 A부터 E, 영화 M1부터 M6의 평점 */
export const RATINGS = [
  [5, 5, 0, 4, 2, 0],
  [5, 4, 5, 4, 3, 1],
  [4, 4, 4, 3, 1, 2],
  [1, 2, 1, 1, 4, 5],
  [4, 3, 4, 4, 5, 5],
];
export const USERS = ['A', 'B', 'C', 'D', 'E'];

/** 영화 M1부터 M7의 장르. 순서는 액션, 코미디, 드라마, SF */
export const FEATURES = [
  [1, 1, 0, 0],
  [1, 0, 1, 0],
  [1, 0, 0, 1],
  [1, 0, 0, 1],
  [0, 1, 1, 0],
  [0, 0, 1, 0],
  [1, 1, 0, 1],
];

export const GENRE_NAMES: Record<string, string[]> = {
  ko: ['액션', '코미디', '드라마', 'SF'],
  en: ['Action', 'Comedy', 'Drama', 'Sci-fi'],
  zh: ['动作', '喜剧', '剧情', '科幻'],
};

export const MOVIE_TITLES: Record<string, string[]> = {
  ko: ['범죄도시 3', '탑건: 매버릭', '아바타: 물의 길', '스파이더맨: 노 웨이 홈', '엘리멘탈', '서울의 봄', '새 어벤져스'],
  en: [
    'The Roundup: No Way Out',
    'Top Gun: Maverick',
    'Avatar: The Way of Water',
    'Spider-Man: No Way Home',
    'Elemental',
    '12.12: The Day',
    'the new Avengers',
  ],
  zh: ['犯罪都市3', '壮志凌云：独行侠', '阿凡达：水之道', '蜘蛛侠：英雄无归', '疯狂元素城', '首尔之春', '新复仇者联盟'],
};
