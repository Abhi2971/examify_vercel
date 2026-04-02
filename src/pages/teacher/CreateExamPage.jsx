import { useState } from 'react'
import { Button, Input, Select, Card, CardHeader, CardBody } from '../../components/ui'

const STEPS = ['Basic Info', 'Configuration', 'Questions', 'Rules', 'Preview']

export function CreateExamPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ title: '', description: '', subject: '', duration: 60, totalQuestions: 30 })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Exam</h1>

      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
              i + 1 <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>{i + 1}</div>
            <span className="ml-2 text-sm hidden md:block">{s}</span>
            {i < STEPS.length - 1 && <div className="w-12 md:w-24 h-0.5 mx-2 bg-gray-200" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>Step {step}: {STEPS[step - 1]}</CardHeader>
        <CardBody className="space-y-4">
          {step === 1 && (
            <>
              <Input label="Exam Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Enter exam title" />
              <Input label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Enter description" />
              <Select label="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} options={[
                { value: 'ds', label: 'Data Structures' },
                { value: 'dbms', label: 'DBMS' },
                { value: 'os', label: 'Operating Systems' },
              ]} placeholder="Select subject" />
            </>
          )}
          {step === 2 && (
            <>
              <Input label="Duration (minutes)" type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
              <Input label="Total Questions" type="number" value={formData.totalQuestions} onChange={e => setFormData({...formData, totalQuestions: e.target.value})} />
            </>
          )}
          {step >= 3 && <p className="text-gray-500">Step {step} content...</p>}
        </CardBody>
      </Card>

      <div className="flex justify-between">
        <Button variant="secondary" disabled={step === 1} onClick={() => setStep(s => s - 1)}>Previous</Button>
        {step < STEPS.length ? (
          <Button onClick={() => setStep(s => s + 1)}>Next</Button>
        ) : (
          <Button>Create Exam</Button>
        )}
      </div>
    </div>
  )
}
