import { Application } from '@nativescript/core';
import { enableLocationServices } from '@nativescript/geolocation';

enableLocationServices().then(() => {
  Application.run({ moduleName: 'app-root' });
}).catch(error => {
  console.error('Error enabling location services:', error);
  Application.run({ moduleName: 'app-root' });
});