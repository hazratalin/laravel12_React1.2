<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Task counts
        $pendingTasksCount = Task::where('status', 'Pending')->count();
        $completedTasksCount = Task::where('status', 'Completed')->count();
        $inProgressTasksCount = Task::where('status', 'In_Progress')->count();

        $myPendingTasksCount = Task::where('status', 'Pending')->where('assigned_user_id', $user->id)->count();
        $myInProgressTasksCount = Task::where('status', 'In_Progress')->where('assigned_user_id', $user->id)->count();
        $myCompletedTasksCount = Task::where('status', 'Completed')->where('assigned_user_id', $user->id)->count();

        // Active tasks with relationships eager-loaded
        $activeTasks = Task::with(['project', 'assignedUser', 'createdBy', 'updatedBy'])
            ->whereIn('status', ['Pending', 'In_Progress'])
            ->where('assigned_user_id', $user->id)
            ->limit(10)
            ->get();

        return Inertia::render('dashboard', [
            'pendingTasksCount' => $pendingTasksCount,
            'completedTasksCount' => $completedTasksCount,
            'inProgressTasksCount' => $inProgressTasksCount,
            'myPendingTasksCount' => $myPendingTasksCount,
            'myInProgressTasksCount' => $myInProgressTasksCount,
            'myCompletedTasksCount' => $myCompletedTasksCount,
            'activeTasks' => TaskResource::collection($activeTasks),
        ]);
    }
}
