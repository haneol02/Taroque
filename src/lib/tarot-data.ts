import { TaroCard, ExampleQuestions } from '@/types/tarot';

export const tarotCards: TaroCard[] = [
  // 메이저 아르카나 (0-21)
  {
    id: 1,
    name: '바보 (The Fool)',
    suit: 'major',
    uprightMeaning: '새로운 시작, 순수함, 자발성, 여행',
    reversedMeaning: '무모함, 경솔함, 리스크, 어리석음',
    keywords: ['시작', '모험', '순수', '자유'],
    imageUrl: '/cards/0. 바보 카드.jpg'
  },
  {
    id: 2,
    name: '마법사 (The Magician)',
    suit: 'major',
    uprightMeaning: '의지력, 기술, 집중력, 리더십',
    reversedMeaning: '조작, 허상, 기만, 능력 부족',
    keywords: ['의지', '창조', '능력', '집중'],
    imageUrl: '/cards/1. 마법사 카드.jpg'
  },
  {
    id: 3,
    name: '여교황 (The High Priestess)',
    suit: 'major',
    uprightMeaning: '직감, 잠재의식, 신비, 내적 지혜',
    reversedMeaning: '비밀, 숨겨진 동기, 직감 무시',
    keywords: ['직감', '지혜', '신비', '내면'],
    imageUrl: '/cards/2. 여사제 카드.jpg'
  },
  {
    id: 4,
    name: '황후 (The Empress)',
    suit: 'major',
    uprightMeaning: '풍요로움, 모성, 창조성, 자연',
    reversedMeaning: '의존성, 질투, 창조성 부족',
    keywords: ['풍요', '모성', '창조', '자연'],
    imageUrl: '/cards/3. 여황제 카드.jpg'
  },
  {
    id: 5,
    name: '황제 (The Emperor)',
    suit: 'major',
    uprightMeaning: '권위, 질서, 안정성, 아버지 역할',
    reversedMeaning: '독재, 권위남용, 경직성',
    keywords: ['권위', '질서', '안정', '리더십'],
    imageUrl: '/cards/4. 황제 카드.jpg'
  },
  {
    id: 6,
    name: '교황 (The Hierophant)',
    suit: 'major',
    uprightMeaning: '전통, 교육, 종교, 정신적 지도',
    reversedMeaning: '교조주의, 반항, 비전통적',
    keywords: ['전통', '교육', '지도', '믿음'],
    imageUrl: '/cards/5. 교황 카드.jpg'
  },
  {
    id: 7,
    name: '연인 (The Lovers)',
    suit: 'major',
    uprightMeaning: '사랑, 조화, 선택, 파트너십',
    reversedMeaning: '불화, 분리, 잘못된 선택',
    keywords: ['사랑', '선택', '조화', '관계'],
    imageUrl: '/cards/6. 연인 카드.jpg'
  },
  {
    id: 8,
    name: '전차 (The Chariot)',
    suit: 'major',
    uprightMeaning: '승리, 의지력, 자제력, 성공',
    reversedMeaning: '실패, 통제력 부족, 방향성 상실',
    keywords: ['승리', '의지', '통제', '성공'],
    imageUrl: '/cards/7. 전차 카드.jpg'
  },
  {
    id: 9,
    name: '힘 (Strength)',
    suit: 'major',
    uprightMeaning: '용기, 인내, 자제력, 부드러운 힘',
    reversedMeaning: '약함, 자신감 부족, 통제력 상실',
    keywords: ['용기', '인내', '자제', '힘'],
    imageUrl: '/cards/8. 힘 카드.jpg'
  },
  {
    id: 10,
    name: '은둔자 (The Hermit)',
    suit: 'major',
    uprightMeaning: '내적 성찰, 고독, 지혜 추구, 안내',
    reversedMeaning: '고립, 외로움, 내적 혼란',
    keywords: ['성찰', '지혜', '고독', '안내'],
    imageUrl: '/cards/9. 은둔자 카드.jpg'
  },
  {
    id: 11,
    name: '운명의 수레바퀴 (Wheel of Fortune)',
    suit: 'major',
    uprightMeaning: '운명, 변화, 행운, 순환',
    reversedMeaning: '불운, 외부 통제, 변화에 대한 저항',
    keywords: ['운명', '변화', '순환', '행운'],
    imageUrl: '/cards/10. 운명의 수레바퀴.jpg'
  },
  {
    id: 12,
    name: '정의 (Justice)',
    suit: 'major',
    uprightMeaning: '공정함, 진실, 균형, 법적 문제',
    reversedMeaning: '불공정, 편견, 불균형',
    keywords: ['정의', '균형', '진실', '공정'],
    imageUrl: '/cards/11. 정의 카드.jpg'
  },
  {
    id: 13,
    name: '매달린 남자 (The Hanged Man)',
    suit: 'major',
    uprightMeaning: '희생, 새로운 관점, 정체, 깨달음',
    reversedMeaning: '지연, 저항, 희생의 의미 없음',
    keywords: ['희생', '관점', '정체', '깨달음'],
    imageUrl: '/cards/12. 행맨 카드.jpg'
  },
  {
    id: 14,
    name: '죽음 (Death)',
    suit: 'major',
    uprightMeaning: '변화, 종료, 재생, 새로운 시작',
    reversedMeaning: '정체, 변화에 대한 저항, 부분적 변화',
    keywords: ['변화', '종료', '재생', '변환'],
    imageUrl: '/cards/13. 죽음 카드.jpg'
  },
  {
    id: 15,
    name: '절제 (Temperance)',
    suit: 'major',
    uprightMeaning: '균형, 중용, 조화, 치유',
    reversedMeaning: '불균형, 과잉, 자제력 부족',
    keywords: ['균형', '조화', '절제', '치유'],
    imageUrl: '/cards/14. 절제 카드.jpg'
  },
  {
    id: 16,
    name: '악마 (The Devil)',
    suit: 'major',
    uprightMeaning: '속박, 유혹, 집착, 물질주의',
    reversedMeaning: '해방, 자유, 극복, 깨달음',
    keywords: ['속박', '유혹', '집착', '해방'],
    imageUrl: '/cards/15. 악마 카드.jpg'
  },
  {
    id: 17,
    name: '탑 (The Tower)',
    suit: 'major',
    uprightMeaning: '급작스러운 변화, 파괴, 계시, 해방',
    reversedMeaning: '내적 변화, 점진적 변화, 재앙 회피',
    keywords: ['변화', '파괴', '계시', '해방'],
    imageUrl: '/cards/16. 타워 카드.jpg'
  },
  {
    id: 18,
    name: '별 (The Star)',
    suit: 'major',
    uprightMeaning: '희망, 치유, 영감, 평화',
    reversedMeaning: '절망, 실망, 신뢰 부족',
    keywords: ['희망', '치유', '영감', '평화'],
    imageUrl: '/cards/17. 별 카드.jpg'
  },
  {
    id: 19,
    name: '달 (The Moon)',
    suit: 'major',
    uprightMeaning: '환상, 직감, 무의식, 혼란',
    reversedMeaning: '현실 직시, 혼란 해소, 진실 발견',
    keywords: ['환상', '직감', '무의식', '혼란'],
    imageUrl: '/cards/18. 달 카드.jpg'
  },
  {
    id: 20,
    name: '태양 (The Sun)',
    suit: 'major',
    uprightMeaning: '성공, 기쁨, 활력, 긍정성',
    reversedMeaning: '일시적 실패, 과도한 낙관',
    keywords: ['성공', '기쁨', '활력', '긍정'],
    imageUrl: '/cards/19. 태양 카드.jpg'
  },
  {
    id: 21,
    name: '심판 (Judgement)',
    suit: 'major',
    uprightMeaning: '부활, 용서, 새로운 기회, 깨달음',
    reversedMeaning: '자기 의심, 가혹한 판단, 기회 놓침',
    keywords: ['부활', '용서', '기회', '깨달음'],
    imageUrl: '/cards/20. 심판 카드.jpg'
  },
  {
    id: 22,
    name: '세계 (The World)',
    suit: 'major',
    uprightMeaning: '완성, 성취, 여행, 성공',
    reversedMeaning: '미완성, 지연, 목표 달성 실패',
    keywords: ['완성', '성취', '여행', '성공'],
    imageUrl: '/cards/21. 세계 카드.jpg'
  },
  
  // 완드 (Wands) 슈트 (23-36)
  {
    id: 23,
    name: '완드 에이스 (Ace of Wands)',
    suit: 'wands',
    uprightMeaning: '새로운 시작, 창조적 에너지, 영감, 성장',
    reversedMeaning: '창조적 막힘, 지연, 좌절',
    keywords: ['창조', '영감', '에너지', '시작'],
    imageUrl: '/cards/완드 에이스.jpg'
  },
  {
    id: 24,
    name: '완드 2 (Two of Wands)',
    suit: 'wands',
    uprightMeaning: '미래 계획, 개인적 힘, 진보, 발견',
    reversedMeaning: '개인적 목표 부족, 불안한 미래',
    keywords: ['계획', '진보', '발견', '힘'],
    imageUrl: '/cards/완드2.jpg'
  },
  {
    id: 25,
    name: '완드 3 (Three of Wands)',
    suit: 'wands',
    uprightMeaning: '확장, 예측, 리더십, 해외 기회',
    reversedMeaning: '계획 지연, 좌절감, 개인적 제한',
    keywords: ['확장', '리더십', '기회', '해외'],
    imageUrl: '/cards/완드3.jpg'
  },
  {
    id: 26,
    name: '완드 4 (Four of Wands)',
    suit: 'wands',
    uprightMeaning: '축하, 조화, 가정, 행복한 관계',
    reversedMeaning: '가정 불화, 불안정, 축하 연기',
    keywords: ['축하', '조화', '가정', '안정'],
    imageUrl: '/cards/완드4.jpg'
  },
  {
    id: 27,
    name: '완드 5 (Five of Wands)',
    suit: 'wands',
    uprightMeaning: '갈등, 경쟁, 의견 차이, 도전',
    reversedMeaning: '갈등 해결, 협력, 타협',
    keywords: ['갈등', '경쟁', '도전', '차이'],
    imageUrl: '/cards/완드5.jpg'
  },
  {
    id: 28,
    name: '완드 6 (Six of Wands)',
    suit: 'wands',
    uprightMeaning: '승리, 성공, 공개적 인정, 진전',
    reversedMeaning: '실패, 자신감 부족, 지연된 성공',
    keywords: ['승리', '성공', '인정', '진전'],
    imageUrl: '/cards/완드6.jpg'
  },
  {
    id: 29,
    name: '완드 7 (Seven of Wands)',
    suit: 'wands',
    uprightMeaning: '방어, 도전에 맞서기, 끈기, 용기',
    reversedMeaning: '패배감, 항복, 압박감',
    keywords: ['방어', '용기', '끈기', '도전'],
    imageUrl: '/cards/완드7.jpg'
  },
  {
    id: 30,
    name: '완드 8 (Eight of Wands)',
    suit: 'wands',
    uprightMeaning: '신속한 행동, 빠른 변화, 소식, 진전',
    reversedMeaning: '지연, 좌절, 내적 조화',
    keywords: ['신속', '변화', '소식', '진전'],
    imageUrl: '/cards/완드8.jpg'
  },
  {
    id: 31,
    name: '완드 9 (Nine of Wands)',
    suit: 'wands',
    uprightMeaning: '경계, 회복력, 끈기, 마지막 추진력',
    reversedMeaning: '편집증, 고립, 완고함',
    keywords: ['경계', '회복력', '끈기', '추진'],
    imageUrl: '/cards/완드9.jpg'
  },
  {
    id: 32,
    name: '완드 10 (Ten of Wands)',
    suit: 'wands',
    uprightMeaning: '부담, 책임, 힘든 일, 성취감',
    reversedMeaning: '부담 해소, 위임, 책임 회피',
    keywords: ['부담', '책임', '성취', '힘듦'],
    imageUrl: '/cards/완드10.jpg'
  },
  {
    id: 33,
    name: '완드 페이지 (Page of Wands)',
    suit: 'wands',
    uprightMeaning: '영감, 아이디어, 학습, 자유로운 정신',
    reversedMeaning: '부주의, 지연, 좌절감',
    keywords: ['영감', '학습', '자유', '아이디어'],
    imageUrl: '/cards/완드 페이지.jpg'
  },
  {
    id: 34,
    name: '완드 나이트 (Knight of Wands)',
    suit: 'wands',
    uprightMeaning: '행동, 모험, 성급함, 충동',
    reversedMeaning: '무모함, 조급함, 공격성',
    keywords: ['행동', '모험', '충동', '성급'],
    imageUrl: '/cards/완드 나이트.jpg'
  },
  {
    id: 35,
    name: '완드 퀸 (Queen of Wands)',
    suit: 'wands',
    uprightMeaning: '자신감, 용기, 결단력, 독립성',
    reversedMeaning: '이기심, 복수심, 질투',
    keywords: ['자신감', '용기', '결단', '독립'],
    imageUrl: '/cards/완드 퀸.jpg'
  },
  {
    id: 36,
    name: '완드 킹 (King of Wands)',
    suit: 'wands',
    uprightMeaning: '자연스러운 리더, 비전, 기업가 정신, 영예',
    reversedMeaning: '무능력, 독재, 오만',
    keywords: ['리더십', '비전', '기업가', '영예'],
    imageUrl: '/cards/완드 킹.jpg'
  },
  
  // 컵 (Cups) 슈트 (37-50)
  {
    id: 37,
    name: '컵 에이스 (Ace of Cups)',
    suit: 'cups',
    uprightMeaning: '새로운 관계, 감정적 시작, 사랑, 직관',
    reversedMeaning: '감정적 막힘, 실망, 슬픔',
    keywords: ['사랑', '감정', '직감', '관계'],
    imageUrl: '/cards/컵 에이스.jpg'
  },
  {
    id: 38,
    name: '컵 2 (Two of Cups)',
    suit: 'cups',
    uprightMeaning: '파트너십, 사랑, 조화, 균형',
    reversedMeaning: '관계 불화, 이별, 불균형',
    keywords: ['파트너십', '사랑', '조화', '연결'],
    imageUrl: '/cards/컵2.jpg'
  },
  {
    id: 39,
    name: '컵 3 (Three of Cups)',
    suit: 'cups',
    uprightMeaning: '우정, 축하, 커뮤니티, 행복',
    reversedMeaning: '사회적 과잉, 가십, 고립',
    keywords: ['우정', '축하', '커뮤니티', '즐거움'],
    imageUrl: '/cards/컵3.jpg'
  },
  {
    id: 40,
    name: '컵 4 (Four of Cups)',
    suit: 'cups',
    uprightMeaning: '명상, 무관심, 재평가, 무료함',
    reversedMeaning: '동기 부여, 집중, 새로운 목표',
    keywords: ['명상', '무관심', '재평가', '내적'],
    imageUrl: '/cards/컵4.jpg'
  },
  {
    id: 41,
    name: '컵 5 (Five of Cups)',
    suit: 'cups',
    uprightMeaning: '실망, 슬픔, 후회, 상실',
    reversedMeaning: '회복, 용서, 희망 찾기',
    keywords: ['실망', '슬픔', '상실', '후회'],
    imageUrl: '/cards/컵5.jpg'
  },
  {
    id: 42,
    name: '컵 6 (Six of Cups)',
    suit: 'cups',
    uprightMeaning: '향수, 과거, 순수함, 어린 시절',
    reversedMeaning: '과거에 얽매임, 현실 도피',
    keywords: ['향수', '과거', '순수', '어린시절'],
    imageUrl: '/cards/컵6.jpg'
  },
  {
    id: 43,
    name: '컵 7 (Seven of Cups)',
    suit: 'cups',
    uprightMeaning: '환상, 선택, 꿈, 불명확',
    reversedMeaning: '현실성, 집중, 결정',
    keywords: ['환상', '선택', '꿈', '불명확'],
    imageUrl: '/cards/컵7.jpg'
  },
  {
    id: 44,
    name: '컵 8 (Eight of Cups)',
    suit: 'cups',
    uprightMeaning: '포기, 떠나기, 실망, 새로운 검색',
    reversedMeaning: '막막함, 두려움, 고립',
    keywords: ['포기', '떠나기', '실망', '검색'],
    imageUrl: '/cards/컵8.jpg'
  },
  {
    id: 45,
    name: '컵 9 (Nine of Cups)',
    suit: 'cups',
    uprightMeaning: '만족, 성취감, 행복, 소원 성취',
    reversedMeaning: '내적 불만, 탐욕, 자만',
    keywords: ['만족', '성취', '행복', '소원'],
    imageUrl: '/cards/컵9.jpg'
  },
  {
    id: 46,
    name: '컵 10 (Ten of Cups)',
    suit: 'cups',
    uprightMeaning: '감정적 완성, 행복한 가족, 조화',
    reversedMeaning: '가정 불화, 가치관 차이',
    keywords: ['완성', '가족', '조화', '행복'],
    imageUrl: '/cards/컵10.jpg'
  },
  {
    id: 47,
    name: '컵 페이지 (Page of Cups)',
    suit: 'cups',
    uprightMeaning: '창조적 기회, 직관적 메시지, 감성',
    reversedMeaning: '감정적 미성숙, 창조적 막힘',
    keywords: ['창조', '직감', '감성', '기회'],
    imageUrl: '/cards/컵 페이지.jpg'
  },
  {
    id: 48,
    name: '컵 나이트 (Knight of Cups)',
    suit: 'cups',
    uprightMeaning: '로맨스, 매력, 상상력, 감정 추구',
    reversedMeaning: '무드 변화, 질투, 비현실',
    keywords: ['로맨스', '매력', '상상', '감정'],
    imageUrl: '/cards/컵 나이트.jpg'
  },
  {
    id: 49,
    name: '컵 퀸 (Queen of Cups)',
    suit: 'cups',
    uprightMeaning: '직관, 동정심, 감정적 안정, 치유',
    reversedMeaning: '감정적 불안정, 의존성',
    keywords: ['직감', '동정', '안정', '치유'],
    imageUrl: '/cards/컵 퀸.jpg'
  },
  {
    id: 50,
    name: '컵 킹 (King of Cups)',
    suit: 'cups',
    uprightMeaning: '감정적 성숙, 관대함, 외교술, 평정심',
    reversedMeaning: '감정 억압, 냉담함, 변덕',
    keywords: ['성숙', '관대', '외교', '평정'],
    imageUrl: '/cards/컵 킹.jpg'
  },
  
  // 소드 (Swords) 슈트 (51-64)
  {
    id: 51,
    name: '소드 에이스 (Ace of Swords)',
    suit: 'swords',
    uprightMeaning: '새로운 아이디어, 정신적 명료성, 진실',
    reversedMeaning: '혼란, 잘못된 정보, 불명확',
    keywords: ['아이디어', '명료성', '진실', '새로운'],
    imageUrl: '/cards/소드 에이스.jpg'
  },
  {
    id: 52,
    name: '소드 2 (Two of Swords)',
    suit: 'swords',
    uprightMeaning: '어려운 결정, 막힘, 회피, 균형',
    reversedMeaning: '결정 내리기, 혼란 해결',
    keywords: ['결정', '막힘', '회피', '균형'],
    imageUrl: '/cards/소드2.jpg'
  },
  {
    id: 53,
    name: '소드 3 (Three of Swords)',
    suit: 'swords',
    uprightMeaning: '가슴 아픔, 슬픔, 배신, 분리',
    reversedMeaning: '치유, 용서, 회복',
    keywords: ['가슴아픔', '슬픔', '배신', '분리'],
    imageUrl: '/cards/소드3.jpg'
  },
  {
    id: 54,
    name: '소드 4 (Four of Swords)',
    suit: 'swords',
    uprightMeaning: '휴식, 명상, 평화로운 숙고',
    reversedMeaning: '불안, 스트레스, 계속되는 문제',
    keywords: ['휴식', '명상', '평화', '숙고'],
    imageUrl: '/cards/소드4.jpg'
  },
  {
    id: 55,
    name: '소드 5 (Five of Swords)',
    suit: 'swords',
    uprightMeaning: '갈등, 패배, 불명예, 자기중심',
    reversedMeaning: '화해, 용서, 교훈 얻기',
    keywords: ['갈등', '패배', '불명예', '자기중심'],
    imageUrl: '/cards/소드5.jpg'
  },
  {
    id: 56,
    name: '소드 6 (Six of Swords)',
    suit: 'swords',
    uprightMeaning: '이동, 여행, 새로운 시작, 회복',
    reversedMeaning: '어려운 전환, 저항',
    keywords: ['이동', '여행', '시작', '회복'],
    imageUrl: '/cards/소드6.jpg'
  },
  {
    id: 57,
    name: '소드 7 (Seven of Swords)',
    suit: 'swords',
    uprightMeaning: '기만, 도둑질, 전략적 행동',
    reversedMeaning: '진실 공개, 정직함',
    keywords: ['기만', '도둑질', '전략', '속임'],
    imageUrl: '/cards/소드7.jpg'
  },
  {
    id: 58,
    name: '소드 8 (Eight of Swords)',
    suit: 'swords',
    uprightMeaning: '제한, 함정, 자기 의심, 피해자 의식',
    reversedMeaning: '해방, 자유, 새로운 관점',
    keywords: ['제한', '함정', '의심', '피해자'],
    imageUrl: '/cards/소드8.jpg'
  },
  {
    id: 59,
    name: '소드 9 (Nine of Swords)',
    suit: 'swords',
    uprightMeaning: '불안, 걱정, 악몽, 후회',
    reversedMeaning: '희망, 회복, 극복',
    keywords: ['불안', '걱정', '악몽', '후회'],
    imageUrl: '/cards/소드9.jpg'
  },
  {
    id: 60,
    name: '소드 10 (Ten of Swords)',
    suit: 'swords',
    uprightMeaning: '배신, 고통의 끝, 바닥, 재시작',
    reversedMeaning: '회복, 재생, 불완전한 끝',
    keywords: ['배신', '고통', '바닥', '재시작'],
    imageUrl: '/cards/소드10.jpg'
  },
  {
    id: 61,
    name: '소드 페이지 (Page of Swords)',
    suit: 'swords',
    uprightMeaning: '호기심, 새로운 아이디어, 경계심',
    reversedMeaning: '가십, 스파이, 부주의한 소통',
    keywords: ['호기심', '아이디어', '경계', '소통'],
    imageUrl: '/cards/소드 페이지.jpg'
  },
  {
    id: 62,
    name: '소드 나이트 (Knight of Swords)',
    suit: 'swords',
    uprightMeaning: '행동 지향, 성급함, 야심, 용감함',
    reversedMeaning: '무모함, 불안, 공격적',
    keywords: ['행동', '성급', '야심', '용감'],
    imageUrl: '/cards/소드 나이트.jpg'
  },
  {
    id: 63,
    name: '소드 퀸 (Queen of Swords)',
    suit: 'swords',
    uprightMeaning: '독립, 직접성, 원칙, 명확한 사고',
    reversedMeaning: '냉담함, 잔인함, 편견',
    keywords: ['독립', '직접', '원칙', '명확'],
    imageUrl: '/cards/소드 퀸.jpg'
  },
  {
    id: 64,
    name: '소드 킹 (King of Swords)',
    suit: 'swords',
    uprightMeaning: '지적 힘, 권위, 진실, 명확한 사고',
    reversedMeaning: '독단, 잔인함, 권력 남용',
    keywords: ['지적', '권위', '진실', '명확'],
    imageUrl: '/cards/소드 킹.jpg'
  },
  
  // 펜타클 (Pentacles) 슈트 (65-78)
  {
    id: 65,
    name: '펜타클 에이스 (Ace of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '새로운 재정 기회, 번영, 물질적 선물',
    reversedMeaning: '기회 놓침, 재정적 불안정',
    keywords: ['기회', '번영', '물질', '선물'],
    imageUrl: '/cards/펜타클 에이스.jpg'
  },
  {
    id: 66,
    name: '펜타클 2 (Two of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '균형 맞추기, 다중 우선순위, 적응',
    reversedMeaning: '균형 상실, 압도감, 무질서',
    keywords: ['균형', '우선순위', '적응', '유연'],
    imageUrl: '/cards/펜타클2.jpg'
  },
  {
    id: 67,
    name: '펜타클 3 (Three of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '협력, 팀워크, 기술 개발, 건축',
    reversedMeaning: '불협화음, 혼자 일하기, 기술 부족',
    keywords: ['협력', '팀워크', '기술', '건축'],
    imageUrl: '/cards/펜타클3.jpg'
  },
  {
    id: 68,
    name: '펜타클 4 (Four of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '보안, 보수성, 저축, 통제',
    reversedMeaning: '관대함, 변화에 열린 마음',
    keywords: ['보안', '보수', '저축', '통제'],
    imageUrl: '/cards/펜타클4.jpg'
  },
  {
    id: 69,
    name: '펜타클 5 (Five of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '재정 손실, 빈곤, 고립, 걱정',
    reversedMeaning: '재정 회복, 영적 부, 새로운 수입',
    keywords: ['손실', '빈곤', '고립', '걱정'],
    imageUrl: '/cards/펜타클5.jpg'
  },
  {
    id: 70,
    name: '펜타클 6 (Six of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '관대함, 자선, 공유, 균형잡힌 교환',
    reversedMeaning: '이기심, 빚, 일방적 관계',
    keywords: ['관대함', '자선', '공유', '교환'],
    imageUrl: '/cards/펜타클6.jpg'
  },
  {
    id: 71,
    name: '펜타클 7 (Seven of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '장기 목표, 지속적 노력, 투자',
    reversedMeaning: '제한된 성공, 조급함',
    keywords: ['장기', '노력', '투자', '결과'],
    imageUrl: '/cards/펜타클7.jpg'
  },
  {
    id: 72,
    name: '펜타클 8 (Eight of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '기술 개발, 장인 정신, 품질 작업',
    reversedMeaning: '완벽주의, 기술 부족, 태만',
    keywords: ['기술', '장인정신', '품질', '개발'],
    imageUrl: '/cards/펜타클8.jpg'
  },
  {
    id: 73,
    name: '펜타클 9 (Nine of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '자립, 재정적 독립, 럭셔리, 성취',
    reversedMeaning: '재정 의존성, 자립 부족',
    keywords: ['자립', '독립', '럭셔리', '성취'],
    imageUrl: '/cards/펜타클9.jpg'
  },
  {
    id: 74,
    name: '펜타클 10 (Ten of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '재정적 안정, 장기적 성공, 가족 유산',
    reversedMeaning: '재정 실패, 가족 분쟁',
    keywords: ['안정', '성공', '유산', '가족'],
    imageUrl: '/cards/펜타클10.jpg'
  },
  {
    id: 75,
    name: '펜타클 페이지 (Page of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '학습 기회, 새로운 직업, 실용적 접근',
    reversedMeaning: '학습 부족, 게으름, 기회 놓침',
    keywords: ['학습', '직업', '실용', '기회'],
    imageUrl: '/cards/펜타클 페이지.jpg'
  },
  {
    id: 76,
    name: '펜타클 나이트 (Knight of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '근면, 책임감, 신뢰성, 인내',
    reversedMeaning: '게으름, 완고함, 무관심',
    keywords: ['근면', '책임', '신뢰', '인내'],
    imageUrl: '/cards/펜타클 나이트.jpg'
  },
  {
    id: 77,
    name: '펜타클 퀸 (Queen of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '실용성, 가정적, 자원 활용, 보안',
    reversedMeaning: '물질주의, 질투, 의존성',
    keywords: ['실용', '가정적', '자원', '보안'],
    imageUrl: '/cards/펜타클 퀸.jpg'
  },
  {
    id: 78,
    name: '펜타클 킹 (King of Pentacles)',
    suit: 'pentacles',
    uprightMeaning: '재정적 성공, 비즈니스 수완, 보안, 관대함',
    reversedMeaning: '탐욕, 부패, 완고함',
    keywords: ['성공', '비즈니스', '보안', '관대'],
    imageUrl: '/cards/펜타클 킹.jpg'
  }
];

export const cardPositions = {
  1: ['현재 상황'],
  3: ['과거/원인', '현재 상황', '미래/조언'],
  5: ['현재 상황', '장애물', '도움', '행동 방향', '최종 결과'],
  7: ['과거', '현재', '미래', '당신의 마음', '상대방/환경', '조언', '최종 메시지']
};

export const exampleQuestions: ExampleQuestions = {
  love: [
    '좋아하는 사람이 있는데 고백해도 될까요?',
    '연인과 요즘 사이가 소원해졌어요',
    '이별한 전 연인이 자꾸 생각나요',
    '새로운 연인을 만날 수 있을까요?'
  ],
  career: [
    '이직을 고민중인데 지금이 좋은 타이밍일까요?',
    '새로운 프로젝트를 맡게 됐는데 잘할 수 있을까요?',
    '창업을 생각하고 있어요',
    '직장에서 승진 기회가 올까요?'
  ],
  life: [
    '요즘 인생 방향을 잃은 것 같아요',
    '중요한 결정을 앞두고 있어요',
    '새로운 도전을 해볼까 고민돼요',
    '앞으로의 인생이 어떻게 될까요?'
  ],
  relationship: [
    '친구와 갈등이 생겼어요',
    '새로운 환경에 적응하기 어려워요',
    '가족 문제로 고민이 많아요',
    '사람들과의 관계가 어려워요'
  ]
};