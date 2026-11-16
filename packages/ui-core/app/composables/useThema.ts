export function useThema() {
  const thema = useState<'light' | 'dark' | 'system'>('thema', () => 'system');

  function setThema(newThema: 'light' | 'dark' | 'system') {
    thema.value = newThema;
  }
  return {
    thema,
    setThema,
  };
}
