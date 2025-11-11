Project 8 — SQL Practice: DDL, DML, DCL, TCL, Joins, Set Ops

This project provides ready-to-run SQL scripts demonstrating:
- DDL: CREATE, ALTER, DROP, TRUNCATE
- DML: SELECT, INSERT, UPDATE, DELETE
- DCL: GRANT, REVOKE
- TCL: SAVEPOINT, ROLLBACK, COMMIT
- Joins: INNER, LEFT, RIGHT, FULL OUTER
- Set operations: UNION, UNION ALL, INTERSECT, MINUS/EXCEPT

Choose your DB engine and run the matching script from the sql/ folder:
- sql/oracle.sql — Oracle (supports MINUS)
- sql/postgres.sql — PostgreSQL (uses EXCEPT instead of MINUS)
- sql/mysql.sql — MySQL 8+ (no INTERSECT/MINUS; includes workarounds)

Usage
1) Open your DB client and connect to a test schema.
2) Run the script for your DB engine.
3) Read inline comments to understand each operation.

Tables
- Customer(customer_id, first_name, last_name, email)
- Employee(employee_id, first_name, last_name, email, manager_id, customer_id nullable)

Notes
- Scripts are idempotent where possible (DROP IF EXISTS when supported).
- Adjust privileges/roles for DCL if your environment restricts GRANT/REVOKE.

# 🔐 Code Breaker – The Array Heist

An interactive educational game that teaches array operations, pattern matching, and algorithmic thinking through an engaging hacking-themed interface.

## 🎮 Game Concept

You are a hacker in training trying to break into a secure system by manipulating a digital code array. The vault's password is hidden in a pattern within the array that you must discover and recreate.

## 🎯 Learning Objectives

- ✅ **Array Insertion** - Add elements at specific positions
- ✅ **Array Deletion** - Remove elements and shift remaining ones
- ✅ **Linear Search** - Find subarrays (pattern matching)
- ✅ **Array Bounds** - Understand index limitations
- ✅ **Shifting Logic** - Learn how elements move during operations

## 🚀 How to Play

### 1. **Visual Array Display**
- The game shows a 10-cell array (initially empty)
- Each cell can hold a number (0-9) or remain empty
- Example: `[ 3 ][ 1 ][ 7 ][ ][ 2 ][ 1 ][ 4 ][ 9 ][ ][  ]`

### 2. **Game Operations**

#### **Insert Operation**
- Enter an index (0-9) and a value (0-9)
- Click "Insert" to add the number at that position
- Existing elements shift right to make room
- **Animation**: New element slides in from the left

#### **Delete Operation**
- Enter an index (0-9) to remove an element
- Click "Delete" to remove the number at that position
- Remaining elements shift left to fill the gap
- **Animation**: Deleted element shrinks and fades out

#### **Search Pattern**
- Enter a pattern like "2,1,4" (comma-separated numbers)
- Click "Search" to find the pattern in the array
- **Animation**: Visual highlighting shows the search process

#### **Reset Array**
- Click "Reset" to clear all elements and start fresh

### 3. **Game Mechanics**

- **Timer**: 60 seconds to complete each level
- **Secret Pattern**: A hidden sequence you must recreate
- **Levels**: Increasing difficulty with longer patterns
- **Operations Count**: Track how many moves you make
- **Best Time**: Record your fastest completion time

## 🎨 Features

### **Visual Effects**
- **Insert Animation**: Elements slide right, new number fades in
- **Delete Animation**: Elements slide left, deleted number shrinks
- **Search Animation**: Highlights each segment during pattern search
- **Success Effects**: Glowing animations for completed patterns
- **Error Feedback**: Shake animations for invalid inputs

### **Sound Effects**
- **Insert**: High-pitched beep (800Hz)
- **Delete**: Low-pitched beep (400Hz)
- **Success**: Medium-pitched beep (1000Hz)
- **Error**: Low error tone (200Hz)
- **Victory**: Musical fanfare melody

### **Progressive Difficulty**
- **Level 1**: Find 2-digit patterns (e.g., [2, 1])
- **Level 2**: Find 3-digit patterns (e.g., [2, 1, 4])
- **Level 3**: Find 4-digit patterns (e.g., [3, 7, 1, 9])
- **Higher Levels**: Random patterns of increasing length

## 🏆 Winning Strategy

1. **Start Small**: Begin by inserting a few numbers to understand the pattern
2. **Use Search**: Test different combinations to narrow down possibilities
3. **Think Ahead**: Plan your insertions to avoid unnecessary deletions
4. **Watch the Timer**: Don't spend too long on any single operation
5. **Learn from Mistakes**: Use the reset function if you get stuck

## 🎯 Educational Value

This game teaches fundamental programming concepts:

- **Array Manipulation**: Understanding how to insert/delete elements
- **Index Management**: Learning about array bounds and positioning
- **Pattern Recognition**: Developing algorithmic thinking skills
- **Time Management**: Working under pressure and constraints
- **Problem Solving**: Breaking down complex tasks into simple operations

## 🚀 Getting Started

1. Open `index.html` in a modern web browser
2. Read the game instructions
3. Start with Level 1 to learn the basics
4. Progress through levels as you improve
5. Try to beat your best time!

## 🛠️ Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript
- **No Dependencies**: Runs entirely in the browser
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Saves your best time between sessions
- **Web Audio API**: Generates sound effects dynamically

## 🎨 Customization

The game is easily customizable:

- **Colors**: Modify CSS variables for different themes
- **Patterns**: Add new secret patterns in the JavaScript
- **Animations**: Adjust timing and effects in CSS
- **Sounds**: Change frequencies and durations for audio effects

## 🏁 Ready to Hack?

Start the game and begin your journey as a Code Breaker! Can you crack the system before time runs out?

---

*Good luck, hacker! The system awaits your skills...* 🚀
