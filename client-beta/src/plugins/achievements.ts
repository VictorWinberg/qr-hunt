import useDialog from '@/store/DialogStore';
import useUser from '@/store/UserStore';
import { api } from '@/utils/api';
import { onApiMutation, onAuthChange } from '@/utils/app-events';

const delay = 3 * 1000;
let timeout = -1;

function scheduleAchievements(): void {
  clearTimeout(timeout);
  timeout = window.setTimeout(() => void newAchievements(), delay);
}

export async function newAchievements(): Promise<void> {
  if (new URLSearchParams(window.location.search).get('intro')) return;

  const achievement = await api.get('/api/achievements/new');
  const dialog = useDialog();
  if (!achievement.err && achievement.data) {
    const { name, title, count, icon } = achievement.data as {
      name: string;
      title?: string;
      count: number;
      icon?: string;
    };
    const countString =
      count > 3 ? `${count}th` : count === 3 ? '3rd' : count === 2 ? '2nd' : '1st';
    const subtitleLines = [
      count > 1 ? 'You got the achievement' : 'You got a new achievement',
      (title || name) as string,
      count > 1 ? `for the ${countString} time` : ''
    ]
      .filter(Boolean)
      .join('\n');

    dialog.setDialog({
      title: 'Great work!',
      subtitle: `${subtitleLines}\n${icon ?? ''}`.trim(),
      options: [
        {
          name: 'OK',
          type: 'success',
          action: async () => {
            await api.put('/api/achievements/new', {
              body: JSON.stringify({ name })
            });
            dialog.close();
            scheduleAchievements();
          }
        }
      ]
    });
  }
}

onAuthChange(() => {
  const user = useUser();
  if (user.isAuthenticated) {
    scheduleAchievements();
  }
});

onApiMutation(() => {
  scheduleAchievements();
});

async function isThankful(): Promise<void> {
  const thankful = await api.get('/api/achievements/thankful');
  const dialog = useDialog();
  if (!thankful.err && !thankful.data) {
    dialog.setDialog({
      title: 'QR Hunt',
      subtitle: 'Do you enjoy QR-Hunt?',
      options: [
        {
          name: 'Yes!',
          type: 'success',
          action: async () => {
            await api.post('/api/achievements/thankful');
            localStorage.setItem('thankful', 'true');
            dialog.close();
          }
        }
      ]
    });
  } else if (!thankful.err) {
    localStorage.setItem('thankful', 'true');
  }
}

if (Math.random() < 0.1 && !localStorage.getItem('thankful')) {
  clearTimeout(timeout);
  timeout = window.setTimeout(() => void isThankful(), 30 * 1000);
}
