// DOM 요소들
const surveyForm = document.getElementById('surveyForm');
const Q4Slider = document.getElementById('Q4Slider');
const Q4Value = document.getElementById('Q4Value');
const resultsModal = document.getElementById('resultsModal');
const resultsContent = document.getElementById('resultsContent');
const closeModal = document.querySelector('.close');

// 슬라이더 값 업데이트
Q4Slider.addEventListener('input', function() {
    Q4Value.textContent = this.value;
});

// 폼 제출 처리
surveyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 폼 데이터 수집
    const formData = new FormData(surveyForm);
    const surveyData = {};
    
    for (let [key, value] of formData.entries()) {
        if (key === 'Q2') {
            // 체크박스는 여러 값이 있을 수 있음
            if (!surveyData[key]) {
                surveyData[key] = [];
            }
            surveyData[key].push(value);
        } else {
            surveyData[key] = value;
        }
    }
    
    // 결과 표시
    showResults(surveyData);
});

// 결과 모달 표시
function showResults(data) {
    let resultsHTML = `
        <div class="results-summary">
            <h3>📊 설문 응답 요약</h3>
            <div class="result-item">
                <strong>Q1. AI 일상화에 대한 느낌:</strong>
                <p>${data.Q1 || '응답 없음'}</p>
            </div>
            <div class="result-item">
                <strong>Q2. 가장 우려되는 점:</strong>
                <p>${Array.isArray(data.Q2) ? data.Q2.join(', ') : (data.Q2 || '응답 없음')}</p>
            </div>
            <div class="result-item">
                <strong>Q3. 규제의 주체:</strong>
                <p>${data.Q3 || '응답 없음'}</p>
            </div>
            <div class="result-item">
                <strong>Q4. AI 창작 대체 가능성:</strong>
                <p>${data.Q4 || '0'}%</p>
            </div>
            <div class="result-item">
                <strong>Q5. 추가 의견:</strong>
                <p>${data.Q5 || '의견 없음'}</p>
            </div>
            <hr>
            <h4>👥 인구통계학적 정보</h4>
            <div class="demographics-results">
                <div class="demo-result">
                    <strong>연령:</strong> ${data.age || '응답 없음'}
                </div>
                <div class="demo-result">
                    <strong>성별:</strong> ${data.gender || '응답 없음'}
                </div>
                <div class="demo-result">
                    <strong>지역:</strong> ${data.region || '응답 없음'}
                </div>
                <div class="demo-result">
                    <strong>AI 사용 빈도:</strong> ${data.ai_usage || '응답 없음'}
                </div>
            </div>
        </div>
    `;
    
    resultsContent.innerHTML = resultsHTML;
    resultsModal.style.display = 'block';
    
    // 로컬 스토리지에 저장
    saveToLocalStorage(data);
}

// 모달 닫기
closeModal.addEventListener('click', function() {
    resultsModal.style.display = 'none';
});

// 모달 외부 클릭시 닫기
window.addEventListener('click', function(e) {
    if (e.target === resultsModal) {
        resultsModal.style.display = 'none';
    }
});

// 로컬 스토리지에 저장
function saveToLocalStorage(data) {
    const timestamp = new Date().toISOString();
    const surveyResponse = {
        timestamp: timestamp,
        data: data
    };
    
    // 기존 응답들 가져오기
    let existingResponses = JSON.parse(localStorage.getItem('aiSurveyResponses') || '[]');
    existingResponses.push(surveyResponse);
    
    // 최대 100개까지만 저장
    if (existingResponses.length > 100) {
        existingResponses = existingResponses.slice(-100);
    }
    
    localStorage.setItem('aiSurveyResponses', JSON.stringify(existingResponses));
    console.log('설문 응답이 저장되었습니다.');
}

// 애니메이션 효과
document.addEventListener('DOMContentLoaded', function() {
    // 질문 카드들에 페이드인 효과
    const questionCards = document.querySelectorAll('.question-card');
    questionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // 헤더 애니메이션
    const header = document.querySelector('.survey-header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-30px)';
    
    setTimeout(() => {
        header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 300);
});

// 입력 필드 포커스 효과
const inputs = document.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// 성공 메시지 표시
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        설문이 성공적으로 제출되었습니다! 감사합니다.
    `;
    
    surveyForm.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// 통계 데이터 표시 (선택사항)
function showStatistics() {
    const responses = JSON.parse(localStorage.getItem('aiSurveyResponses') || '[]');
    if (responses.length === 0) return;
    
    const stats = {
        totalResponses: responses.length,
        q1Stats: {},
        q2Stats: {},
        q3Stats: {},
        q4Average: 0,
        demographics: {
            age: {},
            gender: {},
            region: {},
            aiUsage: {}
        }
    };
    
    let q4Total = 0;
    let q4Count = 0;
    
    responses.forEach(response => {
        const data = response.data;
        
        // Q1 통계
        if (data.Q1) {
            stats.q1Stats[data.Q1] = (stats.q1Stats[data.Q1] || 0) + 1;
        }
        
        // Q2 통계
        if (data.Q2) {
            const concerns = Array.isArray(data.Q2) ? data.Q2 : [data.Q2];
            concerns.forEach(concern => {
                stats.q2Stats[concern] = (stats.q2Stats[concern] || 0) + 1;
            });
        }
        
        // Q3 통계
        if (data.Q3) {
            stats.q3Stats[data.Q3] = (stats.q3Stats[data.Q3] || 0) + 1;
        }
        
        // Q4 평균
        if (data.Q4) {
            q4Total += parseInt(data.Q4);
            q4Count++;
        }
        
        // 인구통계학적 정보
        if (data.age) stats.demographics.age[data.age] = (stats.demographics.age[data.age] || 0) + 1;
        if (data.gender) stats.demographics.gender[data.gender] = (stats.demographics.gender[data.gender] || 0) + 1;
        if (data.region) stats.demographics.region[data.region] = (stats.demographics.region[data.region] || 0) + 1;
        if (data.ai_usage) stats.demographics.aiUsage[data.ai_usage] = (stats.demographics.aiUsage[data.ai_usage] || 0) + 1;
    });
    
    stats.q4Average = q4Count > 0 ? Math.round(q4Total / q4Count) : 0;
    
    console.log('설문 통계:', stats);
    return stats;
} 