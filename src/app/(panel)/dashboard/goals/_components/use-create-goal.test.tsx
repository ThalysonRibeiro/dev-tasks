import { renderHook, act } from '@testing-library/react';
import { UseCreateGoalForm, CreateGoalForm } from './use-create-goal';
import { FieldErrors } from 'react-hook-form';

describe('UseCreateGoalForm Hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => UseCreateGoalForm({}));
    const formValues = result.current.getValues();
    expect(formValues.title).toBe('');
    expect(formValues.desiredWeeklyFrequency).toBe(0);
  });

  it('should initialize with provided initialValues', () => {
    const initialValues = {
      title: 'My Test Goal',
      desiredWeeklyFrequency: 5,
    };
    const { result } = renderHook(() => UseCreateGoalForm({ initialValues }));
    expect(result.current.getValues()).toEqual(initialValues);
  });

  it('should have a validation error for an empty title', async () => {
    const { result } = renderHook(() => UseCreateGoalForm({}));
    let submitSuccess = false;
    let submitData: CreateGoalForm | null = null;
    let submitErrors: FieldErrors<CreateGoalForm> | null = null;

    await act(async () => {
      result.current.setValue('desiredWeeklyFrequency', 1);

      const submitHandler = result.current.handleSubmit(
        (data) => {
          submitSuccess = true;
          submitData = data;
        },
        (errors) => {
          submitSuccess = false;
          submitErrors = errors;
        }
      );

      await submitHandler();
    });

    expect(submitSuccess).toBe(false);
    expect(submitErrors).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((submitErrors as any)?.title).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((submitErrors as any)?.title?.message).toBe('Informe a atividade qeu deseja realizar');
  });

  it('should have a validation error for frequency out of range', async () => {
    const { result } = renderHook(() => UseCreateGoalForm({}));
    let submitSuccess = false;
    let submitData: CreateGoalForm | null = null;
    let submitErrors: FieldErrors<CreateGoalForm> | null = null;

    await act(async () => {
      result.current.setValue('title', 'Test Goal');
      result.current.setValue('desiredWeeklyFrequency', 9);

      const submitHandler = result.current.handleSubmit(
        (data) => {
          submitSuccess = true;
          submitData = data;
        },
        (errors) => {
          submitSuccess = false;
          submitErrors = errors;
        }
      );

      await submitHandler();
    });

    expect(submitSuccess).toBe(false);
    expect(submitErrors).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((submitErrors as any)?.desiredWeeklyFrequency).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((submitErrors as any)?.desiredWeeklyFrequency?.message).toBe('Number must be less than or equal to 7');
  });

  it('should have a validation error for frequency less than 1', async () => {
    const { result } = renderHook(() => UseCreateGoalForm({}));
    let submitSuccess = false;
    let submitData: CreateGoalForm | null = null;
    let submitErrors: FieldErrors<CreateGoalForm> | null = null;

    await act(async () => {
      result.current.setValue('title', 'Test Goal');
      result.current.setValue('desiredWeeklyFrequency', 0);

      const submitHandler = result.current.handleSubmit(
        (data) => {
          submitSuccess = true;
          submitData = data;
        },
        (errors) => {
          submitSuccess = false;
          submitErrors = errors;
        }
      );

      await submitHandler();
    });

    expect(submitSuccess).toBe(false);
    expect(submitErrors).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((submitErrors as any)?.desiredWeeklyFrequency).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((submitErrors as any)?.desiredWeeklyFrequency?.message).toBe('Number must be greater than or equal to 1');
  });

  it('should submit with valid data', async () => {
    const { result } = renderHook(() => UseCreateGoalForm({}));
    let submitSuccess = false;
    let submitData: CreateGoalForm | null = null;
    let submitErrors: FieldErrors<CreateGoalForm> | null = null;

    await act(async () => {
      result.current.setValue('title', 'Valid Goal');
      result.current.setValue('desiredWeeklyFrequency', 5);

      const submitHandler = result.current.handleSubmit(
        (data) => {
          submitSuccess = true;
          submitData = data;
        },
        (errors) => {
          submitSuccess = false;
          submitErrors = errors;
        }
      );

      await submitHandler();
    });

    expect(submitSuccess).toBe(true);
    expect(submitData).toEqual({
      title: 'Valid Goal',
      desiredWeeklyFrequency: 5,
    });
  });

  it('should reset form to default values', async () => {
    const { result } = renderHook(() => UseCreateGoalForm({}));

    await act(async () => {
      result.current.setValue('title', 'Some Goal');
      result.current.setValue('desiredWeeklyFrequency', 3);
    });

    expect(result.current.getValues().title).toBe('Some Goal');
    expect(result.current.getValues().desiredWeeklyFrequency).toBe(3);

    await act(async () => {
      result.current.reset();
    });

    expect(result.current.getValues().title).toBe('');
    expect(result.current.getValues().desiredWeeklyFrequency).toBe(0);
  });

  it('should reset form to initial values when provided', async () => {
    const initialValues = {
      title: 'Initial Goal',
      desiredWeeklyFrequency: 2,
    };
    const { result } = renderHook(() => UseCreateGoalForm({ initialValues }));

    await act(async () => {
      result.current.setValue('title', 'Modified Goal');
      result.current.setValue('desiredWeeklyFrequency', 7);
    });

    expect(result.current.getValues().title).toBe('Modified Goal');
    expect(result.current.getValues().desiredWeeklyFrequency).toBe(7);

    await act(async () => {
      result.current.reset();
    });

    expect(result.current.getValues().title).toBe('Initial Goal');
    expect(result.current.getValues().desiredWeeklyFrequency).toBe(2);
  });

  it('should validate that frequency cannot be negative', async () => {
    const { result } = renderHook(() => UseCreateGoalForm({}));
    let submitSuccess = false;
    let submitData: CreateGoalForm | null = null;
    let submitErrors: FieldErrors<CreateGoalForm> | null = null;

    await act(async () => {
      result.current.setValue('title', 'Test Goal');
      result.current.setValue('desiredWeeklyFrequency', -1);

      const submitHandler = result.current.handleSubmit(
        (data) => {
          submitSuccess = true;
          submitData = data;
        },
        (errors) => {
          submitSuccess = false;
          submitErrors = errors;
        }
      );

      await submitHandler();
    });

    expect(submitSuccess).toBe(false);
    expect(submitErrors).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((submitErrors as any)?.desiredWeeklyFrequency).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((submitErrors as any)?.desiredWeeklyFrequency?.message).toBe('Number must be greater than or equal to 1');
  });

  it('should accept valid frequency values between 1 and 7', async () => {
    const { result } = renderHook(() => UseCreateGoalForm({}));

    for (let frequency = 1; frequency <= 7; frequency++) {
      let submitSuccess = false;
      let submitData: CreateGoalForm | null = null;
      let submitErrors: FieldErrors<CreateGoalForm> | null = null;

      await act(async () => {
        result.current.setValue('title', 'Test Goal');
        result.current.setValue('desiredWeeklyFrequency', frequency);

        const submitHandler = result.current.handleSubmit(
          (data) => {
            submitSuccess = true;
            submitData = data;
          },
          (errors) => {
            submitSuccess = false;
            submitErrors = errors;
          }
        );

        await submitHandler();
      });

      expect(submitSuccess).toBe(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((submitData as any)?.desiredWeeklyFrequency).toBe(frequency);
    }
  });

  it('should handle form submission with validation errors', async () => {
    const { result } = renderHook(() => UseCreateGoalForm({}));
    let submitSuccess = false;
    let submitData: CreateGoalForm | null = null;
    let submitErrors: FieldErrors<CreateGoalForm> | null = null;

    await act(async () => {
      // Os valores padrão já são inválidos: title: '' e desiredWeeklyFrequency: 0
      const submitHandler = result.current.handleSubmit(
        (data) => {
          submitSuccess = true;
          submitData = data;
        },
        (errors) => {
          submitSuccess = false;
          submitErrors = errors;
        }
      );

      await submitHandler();
    });

    expect(submitSuccess).toBe(false);
    expect(submitErrors).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((submitErrors as any)?.title).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((submitErrors as any)?.desiredWeeklyFrequency).toBeDefined();
  });
});