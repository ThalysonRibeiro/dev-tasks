import { render, screen } from '@testing-library/react';
import { GoalsContent } from './goals-content';
import { PendingGoal, WeekSummaryResponse } from '../_types';

// Mock child components
jest.mock('./summary', () => ({
  Summary: jest.fn((props) => <div data-testid="summary-mock">{JSON.stringify(props)}</div>),
}));
jest.mock('./empyt-goal', () => ({
  EmptyGoal: jest.fn(() => <div data-testid="empty-goal-mock" />),
}));
jest.mock('./create-goals', () => ({
  CreateGoals: jest.fn(() => <div data-testid="create-goals-mock" />),
}));

// Mock UI Sheet component
jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div data-testid="sheet-mock">{children}</div>,
}));

const mockSummaryData: WeekSummaryResponse = {
  summary: { completed: 5, total: 10, goalsPerDay: [] },
};

const mockEmptySummaryData: WeekSummaryResponse = {
  summary: { completed: 0, total: 0, goalsPerDay: [] },
};

const mockPendingGoals: PendingGoal[] = [
  { id: '1', title: 'Test Goal', desiredWeeklyFrequency: 3, completionCount: 1 },
];

describe('GoalsContent Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render Summary component when data is not empty', () => {
    render(
      <GoalsContent
        data={mockPendingGoals}
        summaryData={mockSummaryData}
        timeZone="America/Sao_Paulo"
        language="pt-BR"
      />
    );

    expect(screen.getByTestId('summary-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-goal-mock')).not.toBeInTheDocument();
  });

  it('should render EmptyGoal component when data is empty', () => {
    render(
      <GoalsContent
        data={[]}
        summaryData={mockEmptySummaryData}
        timeZone="America/Sao_Paulo"
        language="pt-BR"
      />
    );

    expect(screen.getByTestId('empty-goal-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('summary-mock')).not.toBeInTheDocument();
  });

  it('should always render CreateGoals component when data is present', () => {
    render(
      <GoalsContent
        data={mockPendingGoals}
        summaryData={mockSummaryData}
        timeZone="America/Sao_Paulo"
        language="pt-BR"
      />
    );
    expect(screen.getByTestId('create-goals-mock')).toBeInTheDocument();
  });

  it('should always render CreateGoals component when data is empty', () => {
    render(
      <GoalsContent
        data={[]}
        summaryData={mockEmptySummaryData}
        timeZone="America/Sao_Paulo"
        language="pt-BR"
      />
    );
    expect(screen.getByTestId('create-goals-mock')).toBeInTheDocument();
  });

  it('should pass correct props to Summary component', () => {
    render(
      <GoalsContent
        data={mockPendingGoals}
        summaryData={mockSummaryData}
        timeZone="Europe/London"
        language="en-US"
      />
    );

    const summaryMock = screen.getByTestId('summary-mock');
    const props = JSON.parse(summaryMock.textContent || '{}');

    expect(props.data).toEqual(mockPendingGoals);
    expect(props.summaryData).toEqual(mockSummaryData);
    expect(props.timeZone).toBe('Europe/London');
    expect(props.language).toBe('en-US');
  });
});
