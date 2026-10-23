import platformFS from './platform';

describe('platform file system', () => {
  beforeEach(() => window.localStorage.clear());

  test('uses the development localStorage fallback outside native shells', async () => {
    expect(platformFS.getPlatform()).toBe('dev');

    await platformFS.saveAutoSave({ Island: 'Gettysburg' });

    await expect(platformFS.loadAutoSave()).resolves.toEqual({ Island: 'Gettysburg' });
    await expect(platformFS.checkSaveFileStatus()).resolves.toEqual(expect.objectContaining({ exists: true }));
  });
});

