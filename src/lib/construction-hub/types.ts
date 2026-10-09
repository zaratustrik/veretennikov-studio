export type HubRole = "organizer" | "member"
export type Collection = "decisions" | "tasks" | "topics" | "agenda"
export type HubRecord = { id: string; title: string; body: string; status: string; owner: string; due: string; minutes?: number; updatedAt: string }
export type Invite = { id: string; name: string; role: HubRole; hash: string; active: boolean; createdAt: string }
export type Person = Omit<Invite, "hash">
export type Comment = { id: string; authorId: string; author: string; body: string; target: string; createdAt: string }
export type HubState = {
  version: 1; updatedAt: string;
  meta: { title: string; goal: string; date: string; venue: string; audience: string; chatUrl: string; messenger: string };
  decisions: HubRecord[]; tasks: HubRecord[]; topics: HubRecord[]; agenda: HubRecord[];
  comments: Comment[]; invites: Invite[]; checks: Record<string, boolean>;
  history: { at: string; author: string; text: string }[];
}
export type HubView = Omit<HubState, "invites"> & { people: Person[]; viewer: Person }
export const statuses = {
  decisions: ["Поддержано на встрече", "Нужно согласовать", "Утверждено", "Отложено"],
  tasks: ["К выполнению", "В работе", "Готово", "Нужна помощь"],
  topics: ["Предложение", "Обсуждаем", "В программе", "Для следующей встречи", "Отклонено"],
  agenda: ["Черновик", "Согласовано"],
} as const
