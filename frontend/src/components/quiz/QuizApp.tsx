import React, { useState } from 'react';

interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: string;
}

interface QuizAppProps {
    topic: string;
    questions: Question[];
}

const QuizApp: React.FC<QuizAppProps> = ({ topic, questions }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;

    const handleOptionSelect = (index: number) => {
        if (showExplanation) return;
        setSelectedOption(index);
        setShowExplanation(true);
        if (index === currentQuestion.correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleShare = () => {
        const text = `I just scored ${Math.round((score / questions.length) * 100)}% on the ${topic} Quiz at roadmap.sh! Can you do better?`;
        if (navigator.share) {
            navigator.share({ title: 'My Quiz Score', text, url: window.location.href });
        } else {
            navigator.clipboard.writeText(text);
            alert('Score copied to clipboard!');
        }
    };

    if (isFinished) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '4rem 1.5rem', background: '#111', borderRadius: '16px', border: '1px solid #262626' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 1rem' }}>Quiz Complete!</h2>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: percentage >= 80 ? '#16a34a' : percentage >= 50 ? '#ca8a04' : '#ef4444', marginBottom: '2rem' }}>
                    {percentage}%
                </div>
                <p style={{ color: '#a3a3a3', fontSize: '1.25rem', marginBottom: '2rem' }}>
                    You scored {score} out of {questions.length} correctly.
                </p>
                <button onClick={handleShare} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                    Share Score
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            {/* Header and Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, textTransform: 'capitalize' }}>
                    {topic} Quiz
                </h1>
                <span style={{ color: '#a3a3a3', fontSize: '1rem' }}>
                    {currentIndex + 1} / {questions.length}
                </span>
            </div>
            <div style={{ height: 8, background: '#1c1c1c', borderRadius: '999px', overflow: 'hidden', marginBottom: '3rem' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#22c55e', transition: 'width 0.3s ease' }} />
            </div>

            {/* Question Card */}
            <div style={{ background: '#111', border: '1px solid #262626', borderRadius: '16px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span className="badge badge-gray">{currentQuestion.difficulty}</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4, margin: '0 0 2rem' }}>
                    {currentQuestion.question}
                </h2>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {currentQuestion.options.map((opt, i) => {
                        let bgColor = '#1c1c1c';
                        let borderColor = '#262626';
                        let color = '#fff';

                        if (showExplanation) {
                            if (i === currentQuestion.correctAnswer) {
                                bgColor = 'rgba(22, 163, 74, 0.15)';
                                borderColor = '#16a34a';
                                color = '#22c55e';
                            } else if (i === selectedOption) {
                                bgColor = 'rgba(239, 68, 68, 0.15)';
                                borderColor = '#ef4444';
                                color = '#f87171';
                            }
                        } else if (i === selectedOption) {
                            bgColor = '#333';
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleOptionSelect(i)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '1rem 1.5rem',
                                    fontSize: '1.1rem',
                                    color,
                                    background: bgColor,
                                    border: `2px solid ${borderColor}`,
                                    borderRadius: '12px',
                                    cursor: showExplanation ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    fontFamily: 'inherit'
                                }}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#161616', borderRadius: '12px', borderLeft: `4px solid ${selectedOption === currentQuestion.correctAnswer ? '#16a34a' : '#ef4444'}` }}>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700, color: selectedOption === currentQuestion.correctAnswer ? '#22c55e' : '#f87171' }}>
                            {selectedOption === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                        </h3>
                        <p style={{ margin: 0, color: '#a3a3a3', lineHeight: 1.5 }}>{currentQuestion.explanation}</p>
                    </div>
                )}

                {/* Next Button */}
                {showExplanation && (
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={handleNext} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                            {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizApp;
