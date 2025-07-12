import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { generateGoalSuggestions, generateTaskSuggestions, prioritizeTasks, generateDailySchedule, generateReflectionPrompt } from '../services/ai';
import { Request, Response } from 'express';

const router = Router();

// Generate action plan from user primer
router.post(
  '/action-plan',
  [
    body('primer').isObject().withMessage('Primer must be an object'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { primer } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      // Generate action plan using AI service
      const actionPlan = await generateActionPlanFromPrimer(primer, userId);

      return res.json({
        success: true,
        data: {
          actionPlan,
        },
      });
    } catch (error) {
      console.error('Action plan generation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate action plan',
      });
    }
  }
);

// Generate goal suggestions
router.post(
  '/goal-suggestions',
  [
    body('userInput').isString().notEmpty().withMessage('User input is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { userInput } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const suggestions = await generateGoalSuggestions(userInput, userId);

      return res.json({
        success: true,
        data: {
          suggestions,
        },
      });
    } catch (error) {
      console.error('Goal suggestions error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate goal suggestions',
      });
    }
  }
);

// Generate task suggestions for a goal
router.post(
  '/task-suggestions',
  [
    body('goalId').isString().notEmpty().withMessage('Goal ID is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { goalId } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const suggestions = await generateTaskSuggestions(goalId, userId);

      return res.json({
        success: true,
        data: {
          suggestions,
        },
      });
    } catch (error) {
      console.error('Task suggestions error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate task suggestions',
      });
    }
  }
);

// Prioritize tasks
router.post(
  '/prioritize-tasks',
  [
    body('taskIds').isArray().withMessage('Task IDs must be an array'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { taskIds } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const prioritizedIds = await prioritizeTasks(taskIds, userId);

      return res.json({
        success: true,
        data: {
          prioritizedIds,
        },
      });
    } catch (error) {
      console.error('Task prioritization error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to prioritize tasks',
      });
    }
  }
);

// Generate daily schedule
router.post(
  '/daily-schedule',
  [
    body('date').isISO8601().withMessage('Date must be a valid ISO date'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { date } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const schedule = await generateDailySchedule(userId, new Date(date));

      return res.json({
        success: true,
        data: {
          schedule,
        },
      });
    } catch (error) {
      console.error('Daily schedule error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate daily schedule',
      });
    }
  }
);

// Generate tasks from project brief
router.post(
  '/tasks-from-brief',
  [
    body('projectBrief').isString().notEmpty().withMessage('Project brief is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { projectBrief } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const tasks = await generateTasksFromBrief(projectBrief, userId);

      return res.json({
        success: true,
        data: {
          tasks,
        },
      });
    } catch (error) {
      console.error('Tasks from brief error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate tasks from brief',
      });
    }
  }
);

// Generate reflection prompt
router.get('/reflection-prompt', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const prompt = await generateReflectionPrompt(userId);

    return res.json({
      success: true,
      data: {
        prompt,
      },
    });
  } catch (error) {
    console.error('Reflection prompt error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate reflection prompt',
    });
  }
});

// Helper function to generate action plan from primer
async function generateActionPlanFromPrimer(primer: any, _userId: string) {
  // This would integrate with the AI service to generate a comprehensive action plan
  // For now, return a structured response that matches the frontend expectations
  
  const { goals } = primer;
  
  // Generate tasks based on the primer data
  const actionPlan = [];
  
  // Generate tasks for short-term goals
  if (goals.shortTerm && goals.shortTerm.length > 0) {
    for (const goal of goals.shortTerm.slice(0, 2)) { // Limit to 2 goals for demo
      const tasks = await generateTasksForGoal(goal, 'short-term');
      actionPlan.push(...tasks);
    }
  }
  
  // Generate tasks for long-term goals
  if (goals.longTerm && goals.longTerm.length > 0) {
    for (const goal of goals.longTerm.slice(0, 2)) { // Limit to 2 goals for demo
      const tasks = await generateTasksForGoal(goal, 'long-term');
      actionPlan.push(...tasks);
    }
  }
  
  return actionPlan;
}

async function generateTasksForGoal(goal: string, timeframe: string) {
  // This would use the AI service to generate specific tasks
  // For now, return mock data that's relevant to the goal
  
  const mockTasks = [
    {
      goal: goal,
      task: `Research and plan ${goal.toLowerCase()}`,
      why: `Understanding the requirements and creating a plan will set you up for success`,
      where: 'Quiet workspace with internet access',
      what: `Research best practices, create a detailed plan, and set milestones`,
      how: 'Use online resources, consult experts if needed, and document your findings',
      duration: 120,
      suggested_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      tags: [timeframe, 'planning', 'research'],
      priority: 'high' as const
    },
    {
      goal: goal,
      task: `Set up initial framework for ${goal.toLowerCase()}`,
      why: `Having a solid foundation will make progress easier and more consistent`,
      where: 'Your primary workspace',
      what: `Create the basic structure, tools, and systems needed to work on this goal`,
      how: 'Identify required tools, set up accounts, create folders/documents, establish routines',
      duration: 60,
      suggested_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      tags: [timeframe, 'setup', 'organization'],
      priority: 'medium' as const
    }
  ];
  
  return mockTasks;
}

async function generateTasksFromBrief(_projectBrief: string, _userId: string) {
  // This would use the AI service to generate tasks from a project brief
  // For now, return mock data that's relevant to the brief
  
  const mockTasks = [
    {
      id: '1',
      title: 'Research project requirements',
      description: 'Gather detailed requirements and specifications for the project',
      priority: 'high' as const,
      duration: 60,
      tags: ['research', 'planning']
    },
    {
      id: '2',
      title: 'Create project timeline',
      description: 'Develop a comprehensive timeline with milestones and deadlines',
      priority: 'high' as const,
      duration: 45,
      tags: ['planning', 'timeline']
    },
    {
      id: '3',
      title: 'Set up development environment',
      description: 'Configure tools, frameworks, and development setup',
      priority: 'medium' as const,
      duration: 30,
      tags: ['setup', 'development']
    },
    {
      id: '4',
      title: 'Create initial project structure',
      description: 'Set up folder structure, basic files, and project organization',
      priority: 'medium' as const,
      duration: 45,
      tags: ['setup', 'structure']
    }
  ];
  
  return mockTasks;
}

export default router; 