import { getColorStatus, getColorPriority } from '../colorStatus-priority'

describe('Color Status Priority Utils', () => {
  describe('getColorStatus', () => {
    it('returns correct color for pending status', () => {
      expect(getColorStatus('pending')).toBe('bg-yellow-500')
    })

    it('returns correct color for in_progress status', () => {
      expect(getColorStatus('in_progress')).toBe('bg-blue-500')
    })

    it('returns correct color for completed status', () => {
      expect(getColorStatus('completed')).toBe('bg-green-500')
    })

    it('returns correct color for cancelled status', () => {
      expect(getColorStatus('cancelled')).toBe('bg-red-500')
    })

    it('returns default color for unknown status', () => {
      expect(getColorStatus('unknown')).toBe('bg-gray-500')
    })
  })

  describe('getColorPriority', () => {
    it('returns correct color for low priority', () => {
      expect(getColorPriority('low')).toBe('bg-green-500')
    })

    it('returns correct color for medium priority', () => {
      expect(getColorPriority('medium')).toBe('bg-yellow-500')
    })

    it('returns correct color for high priority', () => {
      expect(getColorPriority('high')).toBe('bg-red-500')
    })

    it('returns default color for unknown priority', () => {
      expect(getColorPriority('unknown')).toBe('bg-gray-500')
    })
  })
})
