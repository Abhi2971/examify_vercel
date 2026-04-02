import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Timer } from '../../components/exam/Timer'
import { QuestionNav } from '../../components/exam/QuestionNav'
import { Button, Card, CardBody } from '../../components/ui'
import { toast } from 'react-hot-toast'

const MOCK_QUESTIONS = [
  { id: 1, text: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'] },
  { id: 2, text: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Linked List'] },
  { id: 3, text: 'What is the primary key?', options: ['Any column', 'Unique identifier', 'First column', 'Foreign key'] },
  { id: 4, text: 'Which OS is not Windows?', options: ['Windows 10', 'Linux', 'macOS', 'Windows 11'] },
  { id: 5, text: 'What does HTML stand for?', options: ['Hyper Text Markup', 'High Tech Machine', 'Home Tool Markup', 'Hyperlinks Text'] },
]

export function ExamAttemptPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(1)
  const [answers, setAnswers] = useState({})

  const handleAnswer = (option) => {
    setAnswers(prev => ({ ...prev, [currentQ]: option }))
  }

  const handleSubmit = () => {
    if (confirm('Are you sure you want to submit?')) {
      toast.success('Exam submitted!')
      setTimeout(() => navigate('/student-college/results'), 2000)
    }
  }

  const handleTimeUp = () => {
    toast.error('Time is up! Exam auto-submitted.')
    navigate('/student-college/results')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-semibold">Data Structures Final Exam</h1>
          <div className="flex items-center gap-4">
            <Timer initialMinutes={10} onTimeUp={handleTimeUp} />
            <Button onClick={handleSubmit}>Submit Exam</Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-4">Question {currentQ} of {MOCK_QUESTIONS.length}</p>
          <h3 className="text-lg font-medium mb-4">{MOCK_QUESTIONS[currentQ - 1].text}</h3>
          <div className="space-y-2">
            {MOCK_QUESTIONS[currentQ - 1].options.map((opt, i) => (
              <label key={i} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${answers[currentQ] === i ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <input type="radio" name="option" checked={answers[currentQ] === i} onChange={() => handleAnswer(i)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" disabled={currentQ === 1} onClick={() => setCurrentQ(prev => prev - 1)}>Previous</Button>
            <Button disabled={currentQ === MOCK_QUESTIONS.length} onClick={() => setCurrentQ(prev => prev + 1)}>Next</Button>
          </div>
        </div>

        <div className="w-64 bg-white dark:bg-gray-800 rounded-xl p-4 h-fit sticky top-24">
          <QuestionNav total={MOCK_QUESTIONS.length} current={currentQ} answers={answers} onSelect={setCurrentQ} />
        </div>
      </div>
    </div>
  )
}
