import { Settings } from './settings.model.js';

export class SettingsService {
  static async getSettings() {
    let settings = await Settings.findOne({ key: 'global_settings' }).lean();
    if (!settings) {
      settings = await Settings.create({ key: 'global_settings' });
    }
    return settings;
  }

  static async updateSettingsSection(section, data) {
    let settings = await Settings.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = new Settings({ key: 'global_settings' });
    }

    if (settings[section]) {
      settings[section] = { ...settings[section], ...data };
      await settings.save();
    }
    return settings;
  }
}
