import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody, Input, Button } from '../../components/ui'

export function ExamGatePage() {
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = () => {
    if (password === 'demo123') {
      navigate('/student-college/exam/ex1/attempt')
    } else {
      alert('Invalid password. Try demo123')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader><h2 className="text-xl font-bold text-center">Enter Exam Password</h2></CardHeader>
        <CardBody className="space-y-4">
          <Input label="Exam Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
          <Button className="w-full" onClick={handleSubmit}>Enter Exam</Button>
          <p className="text-sm text-gray-500 text-center">Demo password: demo123</p>
        </CardBody>
      </Card>
    </div>
  )
}
