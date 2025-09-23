import { renderHook, act, waitFor } from '@testing-library/react';
import { UseNameForm, UseSettingsForm } from './use-settings-form';

describe('Profile Form Hooks', () => {
  describe('UseNameForm', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => UseNameForm({}));
      expect(result.current.getValues().name).toBe('');
    });

    it('should initialize with provided initialValues', () => {
      const { result } = renderHook(() => UseNameForm({ initialValues: { name: 'Test Name' } }));
      expect(result.current.getValues().name).toBe('Test Name');
    });

    it('should validate the name field correctly', async () => {
      const { result } = renderHook(() => UseNameForm({}));
      const onSubmit = jest.fn();

      // Test with invalid data (too short)
      await act(async () => {
        result.current.setValue('name', 'ab');
        await result.current.handleSubmit(onSubmit)();
      });

      // Expect the submit handler NOT to be called
      expect(onSubmit).not.toHaveBeenCalled();

      // Test with valid data
      await act(async () => {
        result.current.setValue('name', 'A Valid Name');
        await result.current.handleSubmit(onSubmit)();
      });

      // Expect the submit handler TO BE called
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('UseSettingsForm', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => UseSettingsForm({}));
      const values = result.current.getValues();
      expect(values.emailNotifications).toBe(true);
      expect(values.pushNotifications).toBe(true);
      expect(values.language).toBe('pt-BR');
      expect(values.timezone).toBe('America/Sao_Paulo');
    });

    it('should initialize with provided initialValues', () => {
      const initialValues = {
        emailNotifications: false,
        pushNotifications: false,
        language: 'en-US',
        timezone: 'America/New_York',
      };
      const { result } = renderHook(() => UseSettingsForm({ initialValues }));
      expect(result.current.getValues()).toEqual(initialValues);
    });
  });
});
