// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const taskListContainer = document.querySelector('.task-list-container');
    
    // Create new task item
    const newTaskItem = document.createElement('div');
    newTaskItem.className = 'task-item';
    
    // Create checkbox
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';
    checkbox.onclick = function() { toggleTask(this); };
    
    const checkmark = document.createElement('span');
    checkmark.className = 'checkmark';
    checkmark.textContent = '☐';
    checkbox.appendChild(checkmark);
    
    // Create task text
    const taskTextSpan = document.createElement('span');
    taskTextSpan.className = 'task-text';
    taskTextSpan.textContent = taskText;
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '⊗';
    deleteBtn.onclick = function() { deleteTask(this); };
    
    // Assemble the task item
    newTaskItem.appendChild(checkbox);
    newTaskItem.appendChild(taskTextSpan);
    newTaskItem.appendChild(deleteBtn);
    
    // Add to the beginning of the list
    taskListContainer.insertBefore(newTaskItem, taskListContainer.firstChild);
    
    // Clear input
    taskInput.value = '';
    
    // Focus back to input for better UX
    taskInput.focus();
}

// Function to toggle task completion
function toggleTask(checkboxElement) {
    const taskItem = checkboxElement.closest('.task-item');
    const taskText = taskItem.querySelector('.task-text');
    const checkmark = checkboxElement.querySelector('.checkmark');
    
    if (taskItem.classList.contains('completed')) {
        // Mark as incomplete
        taskItem.classList.remove('completed');
        checkboxElement.classList.remove('completed');
        taskText.classList.remove('completed');
        checkmark.textContent = '☐';
    } else {
        // Mark as complete
        taskItem.classList.add('completed');
        checkboxElement.classList.add('completed');
        taskText.classList.add('completed');
        checkmark.textContent = '☑';
    }
}

// Function to delete a task
function deleteTask(deleteButton) {
    const taskItem = deleteButton.closest('.task-item');
    
    // Add a fade-out effect
    taskItem.style.opacity = '0';
    taskItem.style.transform = 'translateX(-20px)';
    
    // Remove the element after animation
    setTimeout(() => {
        taskItem.remove();
    }, 300);
}

// Add keyboard support for the input field
document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Initialize the first task as completed (as shown in the image)
document.addEventListener('DOMContentLoaded', function() {
    // The first task is already marked as completed in the HTML
    // This ensures the JavaScript functionality works with the initial state
});
