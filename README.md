# 🧠 Artificial Intelligence Course - Final Report

> A comprehensive summary of everything we learned in our AI course.

---

## 📄 Course Information

- **📚 Course Title:** Artificial Intelligence  
- **👨‍🏫 Instructor:** Rajorshi Projojal  
- **📆 Duration:** January 2025 – June 2025  
- **🧾 Submitted by:** Anik Chowdhury  

---

## 📌 Purpose of the Course

The purpose of this course is to introduce the foundational concepts of **Artificial Intelligence**, including how intelligent agents operate, search algorithms, logic-based reasoning, and machine learning. The course prepares students to:

- Understand real-world AI applications  
- Implement classical search and optimization algorithms  
- Apply game-theory and logical reasoning techniques  
- Work with constraint-based models  
- Explore the basics of reinforcement learning and robotics  

---

## 📘 What We Learned From This Course

---

### 🧠 1. Introduction to AI

#### 🤖 How AI Helps Us
Artificial Intelligence improves daily life by automating processes, predicting outcomes, and learning patterns from data.  
It is used in:

- ✅ Healthcare: Diagnostic tools, patient monitoring  
- ✅ Finance: Fraud detection, loan predictions  
- ✅ Education: Adaptive learning systems  
- ✅ Transport: Autonomous vehicles  
- ✅ Entertainment: Personalized recommendations  

#### 🧪 Examples of AI in Daily Life

- **📍 Google Maps:** Route optimization using real-time data  
- **🎙️ Voice Assistants:** Siri, Alexa using NLP  
- **🎥 Netflix, YouTube:** Content recommendations  
- **📧 Gmail:** Spam detection using classification algorithms  

#### 🧮 Types of AI Algorithms

- Search & Optimization (BFS, A*, Hill Climbing)  
- Game Theory (Minimax, Alpha-Beta)  
- Logic & Reasoning (Propositional, Predicate)  
- Machine Learning (Reinforcement Learning)  

---

### 🔍 2. Search Algorithms

#### 🔸 Uninformed Search

| Algorithm         | Features                                              | Complete | Optimal | Time Complexity | Space Complexity |
|------------------|--------------------------------------------------------|----------|---------|------------------|-------------------|
| **BFS**          | Explores level by level                                | ✔️       | ✔️      | O(b^d)           | O(b^d)            |
| **DFS**          | Explores deepest branch first                          | ✔️       | ❌      | O(b^m)           | O(bm)             |
| **DLS**          | DFS with depth limit                                   | ✔️       | ❌      | O(b^l)           | O(bl)             |
| **IDS**          | DFS + BFS hybrid, optimal with less memory             | ✔️       | ✔️      | O(b^d)           | O(bd)             |
| **Bidirectional**| Two BFS from start and goal                            | ✔️       | ✔️      | O(b^(d/2))       | O(b^(d/2))        |

> b = branching factor, d = depth of solution

#### 🔸 Informed Search (Heuristic-Based)

- **Best-First Search:** Uses a heuristic to choose the most promising path  
- **A\* Search:** f(n) = g(n) + h(n) — optimal with admissible heuristics  
- **AO\* Algorithm:** Handles AND-OR graphs, useful for complex problem solving  

---

### 🔧 3. Heuristic Search Techniques

- **Hill Climbing:** Greedy ascent toward goal, may get stuck in local maxima  
- **Beam Search:** Keeps top-k best candidates at each level for efficiency

---

### ♟️ 4. Game Playing Algorithms

- **Minimax:** Two-player, zero-sum games (e.g., chess, tic-tac-toe)  
- **Alpha-Beta Pruning:** Cuts unnecessary branches from Minimax tree, improves efficiency  

```text
Minimax evaluates all → Alpha-beta skips irrelevant paths!
🧩 5. Constraint Satisfaction Problems (CSP)
🧱 Components:
Variables — e.g., X, Y, Z

Domains — e.g., {Red, Green, Blue}

Constraints — e.g., X ≠ Y

📊 Cryptarithmetic Example:
SEND + MORE = MONEY
Each letter = unique digit → solved via:

Backtracking

Forward Checking

Constraint Propagation

🔍 Local Consistency Techniques:
Type	Description
Arc Consistency	Each value in X has a supporting value in Y
Path Consistency	Extends arc to three-variable constraints
Global	All constraints satisfied across variables

🎯 Advanced Techniques:
MRV Heuristic: Choose variable with fewest legal values

Degree Heuristic: Choose variable involved in most constraints

Forward Checking & Backtracking: Reduce invalid paths early

🔗 6. Logic and Reasoning
🧠 Propositional Logic
Statements with true/false values.
Example:

If it rains → Ground is wet → P → Q

🔄 Inference Types
Term	Logic Form	Example
Inverse	¬P → ¬Q	Not raining → Not wet
Converse	Q → P	Wet ground → It rained
Contrapositive	¬Q → ¬P	Not wet → Not raining

🧾 Normal Forms:
CNF (Conjunctive): AND of ORs

DNF (Disjunctive): OR of ANDs

🔢 Predicate Logic:
Uses variables and quantifiers: ∀x, ∃y
Example: ∀x (Student(x) → Studies(x))

🧮 7. Optimization Algorithms
⛓️ Branch and Bound
Explore all possibilities but prune using bounds

Used for TSP, scheduling, and Knapsack problems

🎒 Knapsack Problem:
Choose items with max value under weight limit
Approaches:

Greedy

Dynamic Programming

Branch & Bound

🕹️ 8. Reinforcement Learning
An agent learns to make decisions based on rewards.

Core Elements:

Agent, Environment

Actions, Rewards

Policy, Q-Values

🔁 Q-learning Formula:
text
Copy
Edit
Q(s, a) ← Q(s, a) + α [r + γ * max Q(s’, a’) − Q(s, a)]
α = Learning rate, γ = Discount factor

📂 9. Information Retrieval (IR)
Process:
Indexing

Query processing

Ranking documents

Evaluation Metrics:
Metric	Description
Precision	Relevant / Retrieved
Recall	Relevant / Total Relevant
F1-Score	Harmonic mean of Precision and Recall
MAP	Mean Average Precision

🤖 10. Robotics
What is a Robot?
An intelligent machine that performs tasks autonomously.

🔧 Hardware:
Sensors, Actuators, Motors, Controllers

💻 Software:
ROS (Robot Operating System), AI Logic, Path Planning

Applications:
🏭 Industrial Automation

🩺 Medical Surgery

🪖 Military Operations

🏠 Home Cleaning

🚀 Space Exploration

Categories:
Wheeled robots

Humanoids

Drones

Swarm robots