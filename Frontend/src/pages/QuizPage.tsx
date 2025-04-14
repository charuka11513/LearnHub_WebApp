import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, Trash2Icon, EditIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Video {
  id: string;
  title: string;
  userName: string;
  postId: string;
}

interface Quiz {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  questions: Question[];
}

interface Question {
  questionText: string;
  answers: string[];
  correctAnswerIndex: number;
}

interface NewQuestion {
  questionText: string;
  answers: string[];
  correctAnswerIndex: number;
}

const VideoQuizPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newQuestions, setNewQuestions] = useState<NewQuestion[]>([
    { questionText: '', answers: ['', '', '', ''], correctAnswerIndex: 0 },
  ]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchVideoAndQuiz = async () => {
      try {
        // Fetch video
        const videoResponse = await fetch(`http://localhost:8080/api/videos/${videoId}`);
        if (!videoResponse.ok) {
          throw new Error(`Failed to fetch video: ${videoResponse.status}`);
        }
        const videoData = await videoResponse.json();
        setVideo(videoData);

        // Fetch quiz
        const quizResponse = await fetch(`http://localhost:8080/api/quizzes/video/${videoId}`);
        if (quizResponse.ok) {
          const quizData = await quizResponse.json();
          setQuiz(quizData);
          setUserAnswers(new Array(quizData.questions.length).fill(-1));
        }
      } catch (error) {
        console.error('Error fetching video or quiz:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoAndQuiz();
  }, [videoId]);

  const handleAddQuestion = () => {
    setNewQuestions([
      ...newQuestions,
      { questionText: '', answers: ['', '', '', ''], correctAnswerIndex: 0 },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (newQuestions.length <= 5) {
      alert('Quiz must have at least 5 questions');
      return;
    }
    setNewQuestions(newQuestions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: string | number) => {
    const updatedQuestions = [...newQuestions];
    if (field === 'questionText') {
      updatedQuestions[index].questionText = value as string;
    } else if (field.startsWith('answer')) {
      const answerIndex = parseInt(field.replace('answer', ''));
      updatedQuestions[index].answers[answerIndex] = value as string;
    } else if (field === 'correctAnswerIndex') {
      updatedQuestions[index].correctAnswerIndex = value as number;
    }
    setNewQuestions(updatedQuestions);
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestions.length < 5) {
      alert('Please add at least 5 questions');
      return;
    }
    for (const q of newQuestions) {
      if (!q.questionText.trim() || q.answers.some(a => !a.trim())) {
        alert('Please fill all question fields and answers');
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:8080/api/quizzes/video/${videoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          userName: user?.name,
          questions: newQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create quiz: ${response.status}`);
      }

      const quizData = await response.json();
      setQuiz(quizData);
      setUserAnswers(new Array(quizData.questions.length).fill(-1));
      setShowCreateForm(false);
      setNewQuestions([{ questionText: '', answers: ['', '', '', ''], correctAnswerIndex: 0 }]);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz');
    }
  };

  const handleUpdateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;
    if (newQuestions.length < 5) {
      alert('Please add at least 5 questions');
      return;
    }
    for (const q of newQuestions) {
      if (!q.questionText.trim() || q.answers.some(a => !a.trim())) {
        alert('Please fill all question fields and answers');
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:8080/api/quizzes/${quiz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          userName: user?.name,
          questions: newQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update quiz: ${response.status}`);
      }

      const updatedQuiz = await response.json();
      setQuiz(updatedQuiz);
      setUserAnswers(new Array(updatedQuiz.questions.length).fill(-1));
      setShowUpdateForm(false);
      setNewQuestions([{ questionText: '', answers: ['', '', '', ''], correctAnswerIndex: 0 }]);
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Failed to update quiz');
    }
  };

  const handleDeleteQuiz = async () => {
    if (!quiz || !window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/quizzes/${quiz.id}?userId=${user?.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete quiz: ${response.status}`);
      }

      setQuiz(null);
      setUserAnswers([]);
      setScore(null);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz');
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionIndex] = answerIndex;
    setUserAnswers(updatedAnswers);
  };

  const handleViewScore = async () => {
    if (!quiz || userAnswers.some(a => a === -1)) {
      alert('Please answer all questions');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/api/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userAnswers),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit answers: ${response.status}`);
      }

      const { score, total } = await response.json();
      setScore(score);
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Failed to submit answers');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link
          to={video ? `/post/${video.postId}/videos` : '/'}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon size={18} className="mr-1" />
          <span>Back to Videos</span>
        </Link>
      </div>
      {video && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Quizzes for Video: "{video.title.length > 60 ? video.title.substring(0, 60) + '...' : video.title}"
          </h1>
          <p className="text-gray-600">Uploaded by {video.userName}</p>
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {!quiz && user && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
          >
            <PlusIcon size={18} className="mr-2" />
            Create Quiz
          </button>
        )}
        {quiz && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Quiz Questions</h2>
              {user?.id === quiz.userId && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setNewQuestions(quiz.questions.map(q => ({ ...q })));
                      setShowUpdateForm(true);
                    }}
                    className="flex items-center px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    <EditIcon size={16} className="mr-1" />
                    Update Quiz
                  </button>
                  <button
                    onClick={handleDeleteQuiz}
                    className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <Trash2Icon size={16} className="mr-1" />
                    Delete Quiz
                  </button>
                </div>
              )}
            </div>
            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="mb-6">
                <p className="text-gray-800 font-medium mb-2">{qIndex + 1}. {question.questionText}</p>
                {question.answers.map((answer, aIndex) => (
                  <div key={aIndex} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`q${qIndex}-a${aIndex}`}
                      name={`question-${qIndex}`}
                      checked={userAnswers[qIndex] === aIndex}
                      onChange={() => handleAnswerSelect(qIndex, aIndex)}
                      className="mr-2"
                    />
                    <label htmlFor={`q${qIndex}-a${aIndex}`} className="text-gray-700">{answer}</label>
                  </div>
                ))}
              </div>
            ))}
            <button
              onClick={handleViewScore}
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'View Score'}
            </button>
            {score !== null && (
              <div className="mt-4">
                <p className="text-lg font-semibold">Your Score: {score} out of {quiz.questions.length}</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${(score / quiz.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
        {!quiz && !showCreateForm && <p className="text-gray-500">No quiz available yet.</p>}
      </div>

      {(showCreateForm || showUpdateForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{showCreateForm ? 'Create Quiz' : 'Update Quiz'}</h2>
            <form onSubmit={showCreateForm ? handleCreateQuiz : handleUpdateQuiz}>
              {newQuestions.map((question, qIndex) => (
                <div key={qIndex} className="mb-6 border-b pb-4 relative">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question {qIndex + 1} *
                    </label>
                    <input
                      type="text"
                      value={question.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {question.answers.map((answer, aIndex) => (
                    <div key={aIndex} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Answer {aIndex + 1} *
                      </label>
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => handleQuestionChange(qIndex, `answer${aIndex}`, e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correct Answer *
                    </label>
                    <select
                      value={question.correctAnswerIndex}
                      onChange={(e) => handleQuestionChange(qIndex, 'correctAnswerIndex', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {question.answers.map((_, aIndex) => (
                        <option key={aIndex} value={aIndex}>Answer {aIndex + 1}</option>
                      ))}
                    </select>
                  </div>
                  {newQuestions.length > 5 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="absolute top-0 right-0 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className="flex space-x-2 mb-4">
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Add Question
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {showCreateForm ? 'Create Quiz' : 'Update Quiz'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowUpdateForm(false);
                    setNewQuestions([{ questionText: '', answers: ['', '', '', ''], correctAnswerIndex: 0 }]);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoQuizPage;