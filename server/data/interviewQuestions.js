// Interview Questions Database
// Simple in-memory storage for MVP (no DynamoDB needed)

const interviewQuestions = [
  {
    id: 'q1',
    difficulty: 'Easy',
    question: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    company: 'Amazon',
    topics: ['Array', 'Hash Table'],
    hints: [
      'Use a hash map to store complements',
      'For each number, check if target - number exists in the map',
      'Return the indices when you find a match'
    ],
    solution: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'q2',
    difficulty: 'Medium',
    question: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    company: 'Google',
    topics: ['String', 'Sliding Window', 'Hash Table'],
    hints: [
      'Use the sliding window technique',
      'Track characters in the current window with a Set',
      'Move the left pointer when you find a duplicate'
    ],
    solution: `function lengthOfLongestSubstring(s) {
  let maxLen = 0;
  let left = 0;
  const seen = new Set();
  
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
}`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(m,n)) where m is charset size'
  },
  {
    id: 'q3',
    difficulty: 'Easy',
    question: 'Valid Parentheses',
    description: 'Given a string containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    company: 'Microsoft',
    topics: ['Stack', 'String'],
    hints: [
      'Use a stack to track opening brackets',
      'For each closing bracket, check if it matches the top of the stack',
      'The string is valid if the stack is empty at the end'
    ],
    solution: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  
  for (let char of s) {
    if (char in pairs) {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  
  return stack.length === 0;
}`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'q4',
    difficulty: 'Easy',
    question: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    company: 'Facebook',
    topics: ['Linked List', 'Recursion'],
    hints: [
      'Use three pointers: prev, current, and next',
      'Iterate through the list and reverse the pointers',
      'Can also be solved recursively'
    ],
    solution: `function reverseList(head) {
  let prev = null;
  let current = head;
  
  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'q5',
    difficulty: 'Medium',
    question: 'Binary Tree Level Order Traversal',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values.',
    company: 'Amazon',
    topics: ['Tree', 'BFS', 'Queue'],
    hints: [
      'Use a queue for breadth-first search',
      'Process nodes level by level',
      'Track the size of each level'
    ],
    solution: `function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'q6',
    difficulty: 'Hard',
    question: 'Merge K Sorted Lists',
    description: 'You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.',
    company: 'Google',
    topics: ['Linked List', 'Heap', 'Divide and Conquer'],
    hints: [
      'Use a min heap to track the smallest element',
      'Or use divide and conquer to merge pairs',
      'Compare k elements at a time'
    ],
    solution: `function mergeKLists(lists) {
  if (!lists || lists.length === 0) return null;
  
  while (lists.length > 1) {
    const mergedLists = [];
    
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = i + 1 < lists.length ? lists[i + 1] : null;
      mergedLists.push(mergeTwoLists(l1, l2));
    }
    
    lists = mergedLists;
  }
  
  return lists[0];
}

function mergeTwoLists(l1, l2) {
  const dummy = { next: null };
  let current = dummy;
  
  while (l1 && l2) {
    if (l1.val < l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  current.next = l1 || l2;
  return dummy.next;
}`,
    timeComplexity: 'O(N log k) where N is total nodes',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'q7',
    difficulty: 'Medium',
    question: 'Product of Array Except Self',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements except nums[i].',
    company: 'Apple',
    topics: ['Array', 'Prefix Sum'],
    hints: [
      'Calculate prefix products from left',
      'Calculate suffix products from right',
      'Combine them without using division'
    ],
    solution: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);
  
  // Left pass
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct;
    leftProduct *= nums[i];
  }
  
  // Right pass
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];
  }
  
  return result;
}`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) excluding output array'
  },
  {
    id: 'q8',
    difficulty: 'Easy',
    question: 'Maximum Subarray',
    description: 'Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum.',
    company: 'Netflix',
    topics: ['Array', 'Dynamic Programming', 'Kadane\'s Algorithm'],
    hints: [
      'Use Kadane\'s algorithm',
      'Track current sum and maximum sum',
      'Reset current sum if it becomes negative'
    ],
    solution: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}`,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  }
];

/**
 * Get daily question (rotates based on day of year)
 */
function getDailyQuestion() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = dayOfYear % interviewQuestions.length;
  return interviewQuestions[index];
}

/**
 * Get question by difficulty
 */
function getQuestionByDifficulty(difficulty) {
  const filtered = interviewQuestions.filter(q => q.difficulty === difficulty);
  if (filtered.length === 0) return interviewQuestions[0];
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/**
 * Get random question
 */
function getRandomQuestion() {
  return interviewQuestions[Math.floor(Math.random() * interviewQuestions.length)];
}

/**
 * Get all questions
 */
function getAllQuestions() {
  return interviewQuestions;
}

module.exports = {
  getDailyQuestion,
  getQuestionByDifficulty,
  getRandomQuestion,
  getAllQuestions
};
