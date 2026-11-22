// 개발자가 지정하는 사용자 평가 문항. 여기서 자유롭게 수정하세요.
// type: choice(선택형) | rating(1~5점, DB의 rating 컬럼에 저장) | text(자유 입력)
module.exports.SURVEY_QUESTIONS = [
  { id: 'q1', type: 'choice', text: '평소 기록 활동에 흥미를 느끼는 편이신가요?', options: ['예', '아니오'] },
  { id: 'q2', type: 'rating', text: '담임선생님의 코멘트가 기록에 대한 긍정적 경험을 주는 데 도움이 되었나요? (1~5점)' },
  { id: 'q3', type: 'text', optional: true, maxLength: 300,
    text: '사용 중 아쉬웠던 점이나 추가하고 싶은 기능이 있다면 자유롭게 작성해 주세요.' },
];
