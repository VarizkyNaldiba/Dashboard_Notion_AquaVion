export type Status = "Not Started" | "In Progress" | "Review" | "Done";

export interface Task {
  id: string;
  wbsCode: string;
  title: string;
  person: string[];
  phase: string;
  level: string;
  status: Status;
  progress: number;
  priority: string;
  categoryTag?: string;
  categoryColor?: "blue" | "green" | "red" | "yellow" | "gray" | "purple" | "orange";
}

export const mockTasks: Task[] = [
  {
    id: "1",
    wbsCode: "1.1",
    title: "Project Initiation and Planning",
    person: ["Alice", "Bob"],
    phase: "Phase 1",
    level: "High",
    status: "Done",
    progress: 1,
    priority: "High",
    categoryTag: "Management",
    categoryColor: "blue",
  },
  {
    id: "2",
    wbsCode: "1.2",
    title: "Requirement Analysis",
    person: ["Bob"],
    phase: "Phase 1",
    level: "Medium",
    status: "Review",
    progress: 0.8,
    priority: "High",
    categoryTag: "Research",
    categoryColor: "purple",
  },
  {
    id: "3",
    wbsCode: "2.1",
    title: "Design Database Architecture",
    person: ["Charlie"],
    phase: "Phase 2",
    level: "High",
    status: "In Progress",
    progress: 0.5,
    priority: "Medium",
    categoryTag: "Backend",
    categoryColor: "orange",
  },
  {
    id: "4",
    wbsCode: "2.2",
    title: "Develop UI Mockups",
    person: ["Alice"],
    phase: "Phase 2",
    level: "Medium",
    status: "Done",
    progress: 1,
    priority: "Low",
    categoryTag: "Design",
    categoryColor: "yellow",
  },
  {
    id: "5",
    wbsCode: "3.1",
    title: "Implement Authentication",
    person: ["Bob", "Charlie"],
    phase: "Phase 3",
    level: "High",
    status: "Not Started",
    progress: 0,
    priority: "High",
    categoryTag: "Backend",
    categoryColor: "orange",
  },
  {
    id: "6",
    wbsCode: "3.2",
    title: "Build Dashboard Components",
    person: ["Alice", "Charlie"],
    phase: "Phase 3",
    level: "High",
    status: "In Progress",
    progress: 0.3,
    priority: "Medium",
    categoryTag: "Frontend",
    categoryColor: "blue",
  },
  {
    id: "7",
    wbsCode: "4.1",
    title: "Integration Testing",
    person: ["Charlie"],
    phase: "Phase 4",
    level: "Medium",
    status: "Not Started",
    progress: 0,
    priority: "Medium",
    categoryTag: "QA",
    categoryColor: "red",
  },
];
