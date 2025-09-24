import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PedingGoals } from '../peding-goals';
import { goalCompletion } from '../../_actions/goal-completion';
import { deleteGoal } from '../../_actions/delete-goal';
import { toast } from 'react-toastify';
import { PendingGoal } from '../../_types';

// Mock dependencies
jest.mock('../../_actions/goal-completion');
jest.mock('../../_actions/delete-goal');
jest.mock('react-toastify');

const mockGoalCompletion = goalCompletion as jest.Mock;
const mockDeleteGoal = deleteGoal as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;

const mockPendingGoals: PendingGoal[] = [
  {
    id: 'goal-1',
    title: 'Incomplete Goal',
    desiredWeeklyFrequency: 5,
    completionCount: 2,
  },
  {
    id: 'goal-2',
    title: 'Completed Goal',
    desiredWeeklyFrequency: 3,
    completionCount: 3,
  },
];

describe('PedingGoals Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a list of pending goals', () => {
    render(<PedingGoals data={mockPendingGoals} />);
    expect(screen.getByLabelText('Complete Incomplete Goal')).toBeInTheDocument();
    expect(screen.getByLabelText('Complete Completed Goal')).toBeInTheDocument();
  });

  it('should call goalCompletion on complete button click', async () => {
    mockGoalCompletion.mockResolvedValue({ data: 'Completed!' });
    render(<PedingGoals data={mockPendingGoals} />);

    const completeButton = screen.getByLabelText('Complete Incomplete Goal');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(mockGoalCompletion).toHaveBeenCalledWith({ goalId: 'goal-1' });
      expect(mockToastSuccess).toHaveBeenCalledWith('Completed!');
    });
  });

  it('should call deleteGoal on delete button click', async () => {
    mockDeleteGoal.mockResolvedValue({ data: 'Deleted!' });
    render(<PedingGoals data={mockPendingGoals} />);

    const deleteButton = screen.getByLabelText('Delete Incomplete Goal');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteGoal).toHaveBeenCalledWith({ goalId: 'goal-1' });
      expect(mockToastSuccess).toHaveBeenCalledWith('Deleted!');
    });
  });

  it('should disable the complete button if goal is completed', () => {
    render(<PedingGoals data={mockPendingGoals} />);
    const completedButton = screen.getByLabelText('Complete Completed Goal');
    expect(completedButton).toBeDisabled();
  });

  it('should show an error toast if goalCompletion fails', async () => {
    mockGoalCompletion.mockResolvedValue({ error: 'Something went wrong' });
    render(<PedingGoals data={mockPendingGoals} />);

    const completeButton = screen.getByLabelText('Complete Incomplete Goal');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Something went wrong');
    });
  });

  it('should show an error toast if deleteGoal fails', async () => {
    mockDeleteGoal.mockResolvedValue({ error: 'Deletion failed' });
    render(<PedingGoals data={mockPendingGoals} />);

    const deleteButton = screen.getByLabelText('Delete Incomplete Goal');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Deletion failed');
    });
  });
});
