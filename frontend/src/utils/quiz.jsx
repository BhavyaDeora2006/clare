export const quizData = {
id: "quiz-1",
title: "Stacks Basics",
totalQuestions: 10,
createdAt: "2026-04-09",

questions_json: [
{
question: "Which data structure follows LIFO?",
options: ["Queue", "Stack", "Tree", "Graph"],
correct_answer: "Stack"
},
{
question: "Which operation adds an element to stack?",
options: ["Push", "Pop", "Insert", "Append"],
correct_answer: "Push"
},
{
question: "Which operation removes the top element?",
options: ["Enqueue", "Pop", "Delete", "Shift"],
correct_answer: "Pop"
},
{
question: "What is the top pointer used for?",
options: [
"To track bottom element",
"To track last inserted element",
"To sort stack",
"To delete stack"
],
correct_answer: "To track last inserted element"
},
{
question: "Stack overflow occurs when?",
options: [
"Stack is empty",
"Stack is full",
"Stack is sorted",
"Stack is reversed"
],
correct_answer: "Stack is full"
},
{
question: "Stack underflow occurs when?",
options: [
"Stack is full",
"Stack is empty",
"Stack is reversed",
"Stack is sorted"
],
correct_answer: "Stack is empty"
},
{
question: "Which of these uses stack internally?",
options: ["Recursion", "Queue", "Heap", "Graph"],
correct_answer: "Recursion"
},
{
question: "Which structure uses FIFO?",
options: ["Stack", "Queue", "Tree", "Graph"],
correct_answer: "Queue"
},
{
question: "Peek operation does what?",
options: [
"Removes top element",
"Returns top element without removing",
"Deletes stack",
"Adds element"
],
correct_answer: "Returns top element without removing"
},
{
question: "Stack can be implemented using?",
options: ["Array", "Linked List", "Both", "None"],
correct_answer: "Both"
}
]
};


export const dummyResponses = [
{
question_index: 0,
question_text: "Which data structure follows LIFO?",
options: ["Queue", "Stack", "Tree", "Graph"],
correct_answer: "Stack",
user_answer: "Stack",
is_correct: true
},
{
question_index: 1,
question_text: "Which operation adds an element to stack?",
options: ["Push", "Pop", "Insert", "Append"],
correct_answer: "Push",
user_answer: "Pop",
is_correct: false
},
{
question_index: 2,
question_text: "Which operation removes the top element?",
options: ["Enqueue", "Pop", "Delete", "Shift"],
correct_answer: "Pop",
user_answer: "Pop",
is_correct: true
},
{
question_index: 3,
question_text: "What is the top pointer used for?",
options: [
"To track bottom element",
"To track last inserted element",
"To sort stack",
"To delete stack"
],
correct_answer: "To track last inserted element",
user_answer: "To sort stack",
is_correct: false
},
{
question_index: 4,
question_text: "Stack overflow occurs when?",
options: [
"Stack is empty",
"Stack is full",
"Stack is sorted",
"Stack is reversed"
],
correct_answer: "Stack is full",
user_answer: "Stack is full",
is_correct: true
},
{
question_index: 5,
question_text: "Stack underflow occurs when?",
options: [
"Stack is full",
"Stack is empty",
"Stack is reversed",
"Stack is sorted"
],
correct_answer: "Stack is empty",
user_answer: "Stack is empty",
is_correct: true
},
{
question_index: 6,
question_text: "Which of these uses stack internally?",
options: ["Recursion", "Queue", "Heap", "Graph"],
correct_answer: "Recursion",
user_answer: "Queue",
is_correct: false
},
{
question_index: 7,
question_text: "Which structure uses FIFO?",
options: ["Stack", "Queue", "Tree", "Graph"],
correct_answer: "Queue",
user_answer: "Queue",
is_correct: true
},
{
question_index: 8,
question_text: "Peek operation does what?",
options: [
"Removes top element",
"Returns top element without removing",
"Deletes stack",
"Adds element"
],
correct_answer: "Returns top element without removing",
user_answer: "Removes top element",
is_correct: false
},
{
question_index: 9,
question_text: "Stack can be implemented using?",
options: ["Array", "Linked List", "Both", "None"],
correct_answer: "Both",
user_answer: "Both",
is_correct: true
}
];
