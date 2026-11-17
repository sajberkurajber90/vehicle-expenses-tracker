export function useThema() {
  const thema = useState<'light' | 'dark' | 'system'>('thema', () => 'system');

  function setThema(newThema: 'light' | 'dark' | 'system') {
    thema.value = newThema;
  }

  useHead({
    htmlAttrs: {
      'data-theme': computed(() => thema.value === 'system' ? undefined : thema.value),
    }
  })

  return {
    thema,
    setThema,
  };
}
