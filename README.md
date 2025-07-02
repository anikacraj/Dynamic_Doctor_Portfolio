
🧠 Artificial Intelligence Course - Final Report
📚 Course Title: Artificial Intelligence
👨‍🏫 Course Instructor: Rajorshi Projojal 
📆 Course Duration: Jan 2025 to June 2025
🧾 Submitted by: Anik Chowdhury


📌 Purpose of the Course
The main goal of this course is to introduce students to the fundamental concepts, methodologies, and real-world applications of Artificial Intelligence (AI). It aims to build a solid foundation in both theoretical understanding and practical implementation of AI techniques such as:

Search and optimization algorithms

Game-playing and adversarial search

Logic and reasoning

Constraint satisfaction

Robotics and intelligent systems

Machine learning (specifically reinforcement learning)

By the end of the course, students are expected to design basic intelligent agents, solve complex AI problems, and analyze AI systems' behavior and efficiency.


📘 What We Learned From This Course

🧠 1. Introduction to AI

🤖 How AI Helps Us
Artificial Intelligence helps automate tasks, make predictions, recommend actions, and mimic human intelligence. It is widely used in areas like:

Healthcare (diagnostic tools)

Finance (fraud detection, credit scoring)

Education (adaptive learning systems)

Transportation (self-driving cars)

Entertainment (recommendation systems)

🧪 Examples in Daily Life
Google Maps: Pathfinding and traffic prediction using AI.

Siri / Alexa / Google Assistant: NLP-based voice assistants.

Netflix / YouTube: Recommendation systems.

Email Filters: Spam classification using machine learning.

📌 Types of AI Algorithms
Search Algorithms

Optimization Techniques

Game Theory

Logic and Inference

Machine Learning (Supervised, Unsupervised, Reinforcement)

🔹 2. Search Algorithms
🔸 Uninformed Search
Breadth-First Search (BFS): Explores all nodes at the present depth before moving deeper. Complete and guarantees shortest path.

Depth-First Search (DFS): Explores as far as possible along one branch before backtracking. Uses less memory but may not find optimal solution.

Iterative Deepening Search (IDS): Combines DFS and BFS. Memory-efficient and complete.

Bidirectional Search: Simultaneously searches forward from start and backward from goal, reducing search time.

Depth-Limited Search: DFS with a depth limit to avoid infinite loops.

🔸 Informed Search (Heuristic-based)
Best-First Search: Selects the path that appears best according to a heuristic function.

A Search Algorithm:* Combines cost to reach a node and estimated cost to goal. Complete, optimal with an admissible heuristic.

AO Algorithm:* Designed for solving problems represented by AND-OR graphs. Explores most promising nodes first based on cost and heuristic.

Efficiency & Complexity:

BFS: Time/Space - O(b^d)

DFS: Time - O(b^m), Space - O(bm)

A*: Time/Space - O(b^d), efficient with good heuristics

🔹 3. Heuristic Search Techniques
Hill Climbing: An iterative algorithm that moves toward increasing value (uphill) to find peak. May get stuck at local maxima.

Beam Search: Keeps track of ‘k’ best paths at each level. More memory-efficient than BFS.

🔹 4. Game Playing Algorithms
Minimax Algorithm: Used for decision-making in two-player games. Assumes opponent plays optimally.

Alpha-Beta Pruning: Improves minimax by eliminating branches that won't influence final decision. Greatly reduces time complexity.


📐 5. Constraint Satisfaction Problems (CSP)
3 Main Components
Variables: X, Y, Z (e.g., colors, digits)

Domains: {Red, Green, Blue} or {0-9}

Constraints: X ≠ Y, A + B = C

Cryptarithmetic Example
SEND + MORE = MONEY
Each letter → unique digit
Solved using:

Backtracking

Forward checking

Constraint propagation

Local Consistency Concepts
Arc Consistency (AC-3): Each value in X has consistent value in Y

Path Consistency: Checks 3-variable relationships

Global Consistency: Entire problem satisfies constraints

Advanced Techniques
MRV (Minimum Remaining Values): Choose variable with fewest legal values

Degree Heuristic: Variable with most constraints on others

Forward Checking: Eliminate values that violate constraints

Backtracking: Try, fail, and undo method


🔗 6. Logic and Reasoning
Propositional Logic
Deals with true/false values.

Example: "If it rains, the ground is wet." → P → Q

Inference Types:
Term	Definition	Example
Inverse	¬P → ¬Q	If not raining, ground not wet
Converse	Q → P	If ground is wet, then it rained
Contrapositive	¬Q → ¬P	If ground is not wet, then it didn’t rain

Normal Forms
CNF (Conjunctive): AND of ORs

DNF (Disjunctive): OR of ANDs

Predicate Logic
Includes quantifiers (∀, ∃)

Example: ∀x (Student(x) → Studies(x))

🧩 7. Optimization Algorithms
Branch and Bound
Search tree with bound values to prune suboptimal paths.

Used for TSP, scheduling, knapsack.

Knapsack Problem
Given weight limit and items, choose max value.

Solved using:

Greedy

Dynamic Programming

Branch & Bound


🕹️ 8. Reinforcement Learning (RL)
Agent, Environment, Actions, Rewards

Learns best actions through exploration and exploitation

Q-learning Formula:
Q(s, a) ← Q(s, a) + α [r + γ max Q(s’, a’) − Q(s, a)]

α = learning rate, γ = discount factor



📂 9. Information Retrieval (IR) System Evaluation
Involves:

Document indexing

Query processing

Ranking algorithms

Evaluation Metrics
Metric	Description
Precision	Relevant documents retrieved / Total retrieved
Recall	Relevant docs retrieved / Total relevant docs
F1 Score	Harmonic mean of Precision & Recall
MAP	Mean Average Precision

🤖 10. Robotics
Definition
A robot is an intelligent machine capable of performing tasks autonomously.

Applications
Industrial (welding, assembly)

Military (bomb defusal)

Medical (surgical robots)

Domestic (vacuum robots)

Space (rovers)

Categories
Wheeled robots

Humanoid robots

Swarm robots

Aerial drones

Requirements
Hardware: Sensors, motors, controllers

Software: Pathfinding, AI logic, ROS