const STATUS_ON_DECK = { id: 1, label: "On Deck", color: "blue.300" };
const STATUS_IN_PROGRESS = {
  id: 2,
  label: "In Progress",
  color: "yellow.400",
};
const STATUS_TESTING = { id: 3, label: "Testing", color: "pink.300" };
const STATUS_DEPLOYED = { id: 4, label: "Deployed", color: "green.300" };
export const STATUSES = [
  STATUS_ON_DECK,
  STATUS_IN_PROGRESS,
  STATUS_TESTING,
  STATUS_DEPLOYED,
];
export const status = [
  {
    id: 1,
    label: "Pending",
    color: "#f59e0b",
  },
  {
    id: 2,
    label: "In Progress",
    color: "#3b82f6",
  },
  {
    id: 3,
    label: "Completed",
    color: "#10b981",
  },
  {
    id: 4,
    label: "Cancelled",
    color: "#ef4444",
  },
  {
    id: 5,
    label: "On Hold",
    color: "#8b5cf6",
  },
];

export const DATA = [
  {
    task: "Add a New Feature",
    status: {
      id: 1,
      label: "Pending",
      color: "#f59e0b",
    },
    due: new Date("2023/10/15"),
    notes: "This is a note",
  },
  {
    task: "Write Integration Tests",
    status: {
      id: 2,
      label: "In Progress",
      color: "#3b82f6",
    },
    due: null,
    notes: "Use Jest",
  },
  {
    task: "Add Instagram Integration",
    status: {
      id: 3,
      label: "Completed",
      color: "#10b981",
    },
    due: null,
    notes: "",
  },
  {
    task: "Cleanup Database",
    status: null,
    due: new Date("2023/02/15"),
    notes: "Remove old data",
  },
  {
    task: "Refactor API Endpoints",
    status: {
      id: 5,
      label: "On Hold",
      color: "#8b5cf6",
    },
    due: null,
    notes: "",
  },
  {
    task: "Add Documentation to API",
    status: null,
    due: new Date("2023/09/12"),
    notes: "Add JS Docs to all endpoints",
  },
  {
    task: "Update NPM Packages",
    status: {
      id: 2,
      label: "In Progress",
      color: "#3b82f6",
    },
    due: null,
    notes: "Upgrade React & Chakra UI",
  },
];

export default DATA;
