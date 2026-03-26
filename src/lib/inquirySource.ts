/** Neįpareigojantis laukas „Kaip apie mus sužinojote?“ */

export const INQUIRY_SOURCE_OPTIONS = [
  { value: '', label: 'Nepasirinkta' },
  { value: 'screen_in_city', label: 'Pamačiau ekraną mieste' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'google', label: 'Google paieška' },
  { value: 'recommended', label: 'Rekomendavo' },
] as const;

export type InquirySourceValue = (typeof INQUIRY_SOURCE_OPTIONS)[number]['value'];

export function getInquirySourceLabel(value: string): string {
  const opt = INQUIRY_SOURCE_OPTIONS.find((o) => o.value === value);
  return (opt?.label ?? value) || 'Nepateikta';
}
