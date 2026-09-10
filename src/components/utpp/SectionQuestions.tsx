import type { SectionId } from "@/types/utpp"
import { questionsForSection } from "@/lib/utpp/questions"

import QuestionBlock from "./QuestionBlock"

/**
 * Вопросы, относящиеся к разделу. Раздел без вопросов ничего не рендерит и
 * не выглядит незаконченным — вопросы стоят там, где им есть чем помочь,
 * а не равномерно по всей ленте.
 */
export default function SectionQuestions({ sectionId }: { sectionId: SectionId }) {
  const list = questionsForSection(sectionId)
  if (list.length === 0) return null

  return (
    <div className="utpp-page-questions">
      {list.map((question) => (
        <QuestionBlock key={question.id} question={question} />
      ))}
    </div>
  )
}
