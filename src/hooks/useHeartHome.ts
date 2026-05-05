import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { INITIAL_ARTICLES, INITIAL_MEDS, DEFAULT_PROFILE } from '../services/seedData';

export function useHeartHome() {
  const profile = useLiveQuery(() => db.patientProfile.get('me'));
  const settings = useLiveQuery(() => db.settings.get('global'));

  useEffect(() => {
    const init = async () => {
      // Check if data exists, if not, seed it
      const profileCount = await db.patientProfile.count();
      if (profileCount === 0) {
        await db.patientProfile.add(DEFAULT_PROFILE);
      }

      const medCount = await db.medications.count();
      if (medCount === 0) {
        await db.medications.bulkAdd(INITIAL_MEDS);
      }

      const articleCount = await db.articles.count();
      if (articleCount === 0) {
        await db.articles.bulkAdd(INITIAL_ARTICLES);
      }

      const settingsCount = await db.settings.count();
      if (settingsCount === 0) {
        await db.settings.add({
          id: 'global',
          theme: 'light',
          highContrast: false,
          reducedMotion: false,
          plainLanguage: false,
          caregiverMode: false
        });
      }
    };

    init();
  }, []);

  return { profile, settings, isReady: !!profile && !!settings };
}
