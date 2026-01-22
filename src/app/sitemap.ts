import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://brisa-galley.vercel.app';
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collection`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/place`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/call`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}

const test = {
  surveyStatList: [
    {
      surveyId: '설문ID',
      surveyTitle: '설문 제목',
      groupName: '설문 등록 시 지정한 그룹명',
      questionList: [
        // 주관식 타입 질문 예시
        {
          questionId: '질문ID',
          questionTitle: '질문 제목 - 주관식 예시',
          questionType: '3', // 1: 객관식, 3: 주관식(2: 다중선택은 사용하지 않음)
          answerStatList: [
            {
              surveyId: '설문ID', // 이후 없앨 예정 / 현재는 행별 데이터 로깅을 위해 추가해뒀으므로, 이 값이 필요하다면 BE에 요청하거나 상위 프로퍼티 이용
              surveyTitle: '설문 제목', // 삭제 예정
              questionId: '질문ID', // 삭제 예정
              questionTitle: '질문 제목 - 주관식 예시', // 삭제 예정
              questionType: '3', // 삭제 예정
              questionExampleId: 1, // 답변ID
              questionExampleContent: '주관식 답변', // 답변지
              score: 0, // 점수
              answeredCount: 0, // 이 답변지로 응답한 사람 수
            },
          ],
          totalAnswerCount: 0, // 이 질문에 답변한 전체 수 - 주관식은 답변지가 1개이므로 사실상 answerStatList[0].answeredCount와 동일
          totalRespondentCount: 10,
          responseRate: 0,
          averageScore: 0,
        },
        // 객관식 타입 질문 예시
        {
          questionId: '질문ID',
          questionTitle: '질문2',
          questionType: '1',
          answerStatList: [
            // 답변 목록
            {
              surveyId: 'ff8080819bbbf075019bbbf20273000c',
              surveyTitle: '상담 결과 조사 설문 - 2026 상반기',
              questionId: 'ff8080819bbbf075019bbbf1df9f0007',
              questionTitle: '상담 결과에 만족하십니까?',
              questionType: '1',
              questionExampleId: 1,
              questionExampleContent: '매우 만족',
              score: 100,
              answeredCount: 1,
            },
            {
              surveyId: 'ff8080819bbbf075019bbbf20273000c',
              surveyTitle: '상담 결과 조사 설문 - 2026 상반기',
              questionId: 'ff8080819bbbf075019bbbf1df9f0007',
              questionTitle: '상담 결과에 만족하십니까?',
              questionType: '1',
              questionExampleId: 2,
              questionExampleContent: '만족',
              score: 90,
              answeredCount: 0,
            },
            {
              surveyId: 'ff8080819bbbf075019bbbf20273000c',
              surveyTitle: '상담 결과 조사 설문 - 2026 상반기',
              questionId: 'ff8080819bbbf075019bbbf1df9f0007',
              questionTitle: '상담 결과에 만족하십니까?',
              questionType: '1',
              questionExampleId: 3,
              questionExampleContent: '보통',
              score: 80,
              answeredCount: 0,
            },
            {
              surveyId: 'ff8080819bbbf075019bbbf20273000c',
              surveyTitle: '상담 결과 조사 설문 - 2026 상반기',
              questionId: 'ff8080819bbbf075019bbbf1df9f0007',
              questionTitle: '상담 결과에 만족하십니까?',
              questionType: '1',
              questionExampleId: 4,
              questionExampleContent: '불만족(최대100자)',
              score: 70,
              answeredCount: 0,
            },
          ],
          totalAnswerCount: 1,
          totalRespondentCount: 10,
          responseRate: 10,
          averageScore: 100,
        },
      ],
    },
  ],
};
