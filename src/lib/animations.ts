// 공통 애니메이션 클래스 및 유틸리티

// 페이드 인 애니메이션
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// 슬라이드 업 애니메이션
export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// 슬라이드 다운 애니메이션
export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// 스케일 애니메이션
export const scale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

// 스태거 애니메이션을 위한 지연 함수
export const staggerDelay = (index: number, baseDelay: number = 0.1) => ({
  transition: { delay: index * baseDelay },
});

// 트랜지션 타이밍
export const transitions = {
  fast: { duration: 0.2 },
  default: { duration: 0.3 },
  slow: { duration: 0.5 },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
};

// CSS 애니메이션 클래스 (Tailwind)
export const cssAnimations = {
  // 페이드 인
  fadeIn: 'animate-in fade-in duration-300',

  // 슬라이드 인
  slideInFromTop: 'animate-in slide-in-from-top duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom duration-300',
  slideInFromLeft: 'animate-in slide-in-from-left duration-300',
  slideInFromRight: 'animate-in slide-in-from-right duration-300',

  // 스케일
  scaleIn: 'animate-in zoom-in-95 duration-200',

  // 스핀
  spin: 'animate-spin',

  // 펄스
  pulse: 'animate-pulse',
};
