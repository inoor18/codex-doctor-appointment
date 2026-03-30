export const generateSlots = (start = 9, end = 17) => {
  const slots: string[] = [];
  for (let hour = start; hour < end; hour++) {
    for (const minute of [0, 15, 30, 45]) {
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  return slots;
};

export const validSlots = new Set(generateSlots());
