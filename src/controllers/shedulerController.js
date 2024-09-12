const taskModel = require('../models/taskModel');
const personModel = require('../models/personModel');
const assignmentModel = require('../models/assignmentModel');
const db = require('../database/db');

// Transform the data to match the scheduler structure
const transformToSchedulerData = async () => {
  try {
    const tasks = await taskModel.getAllTasks();
    const people = await personModel.getAllPeople();
    const assignments = await assignmentModel.getAllAssignments();

    return {
      success: true,
      project: {
        calendar: 'workhours',
      },
      calendars: {
        rows: [
          {
            id: 'workhours',
            name: 'Working hours',
          },
        ],
      },
      resources: {
        rows: people.map(person => ({
          id: String(person.id),
          name: person.name,
          team: person.team,
        })),
      },
      events: {
        rows: tasks.map(task => ({
          id: String(task.id),
          name: task.name,
          startDate: task.startDate,
          endDate: task.endDate,
          percentDone: String(task.percentDone),
          note: task.note,
        })),
      },
      assignments: {
        rows: assignments.map(assignment => ({
          id: assignment.id,
          event: String(assignment.event),  // Task ID
          resource: String(assignment.resource),  // Person ID
        })),
      },
    };
  } catch (err) {
    throw new Error('Error transforming scheduler data: ' + err.message);
  }
};

// Controller to handle GET request for scheduler data
exports.getSchedulerData = async (req, res) => {
  try {
    const schedulerData = await transformToSchedulerData();
    res.json(schedulerData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch scheduler data' });
  }
};

// Controller to handle POST request to save scheduler data
exports.saveSchedulerData = async (req, res) => {
  const { events, resources, assignments } = req.body;
  // const { events, assignments } = req.body;

  // console.log(events);

  // if(events!=undefined)
  // {
  //   console.log(events.added);
  // }
  if(assignments!=undefined)
  {
    console.log(assignments.added);
  }
  try {
    await db.run('BEGIN TRANSACTION');

    // Insert or update tasks
    if(events!=undefined)
    {
      if(events.added !=undefined)
      {
        for (const event of events.added) {
          await taskModel.upsertTask(event);
        }
      }
      if(events.removed !=undefined)
      {
        for (const event of events.removed) {
          await taskModel.deleteTask(event);
        }
      }
    }

    // Insert or update people
    if(resources!=undefined)
    {
      for (const resource of resources.added) {
        await personModel.upsertPerson(resource);
      }
    }

    // Insert or update assignments
    if(assignments!=undefined)
    {
      for (const assignment of assignments.added) {
        await assignmentModel.upsertAssignment(assignment);
      }
    }

    await db.run('COMMIT');
    res.status(200).json({ success: true, message: 'Scheduler data saved successfully' });
    
    console.error('Scheduler data saved successfully' );
  } catch (err) {
    await db.run('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to save scheduler data' });
  }
};
